"""Attendance API routes."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id, get_current_user
from shared_libs.database.postgres import get_db_session_dependency

from ..schemas.request import PunchRequest, SettingsUpdateRequest
from ..schemas.response import (
    AttendanceEventOut,
    SessionSummaryResponse,
    TenantSettingsOut,
)
from ..services.business import AttendanceBusiness

router = APIRouter(tags=["attendance"])


def _client_ip(request: Request) -> Optional[str]:
    fwd = request.headers.get("x-forwarded-for") or request.headers.get("X-Forwarded-For")
    if fwd:
        return fwd.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None


def _parse_iso_dt(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    s = value.strip().replace("Z", "+00:00")
    dt = datetime.fromisoformat(s)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _user_uuid(payload: dict) -> UUID:
    sub = payload.get("sub") or payload.get("user_id")
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token: missing subject")
    return UUID(str(sub))


def _user_email(payload: dict) -> str:
    return (payload.get("email") or payload.get("preferred_username") or "") or ""


def _user_role(payload: dict) -> str:
    r = payload.get("role")
    if isinstance(r, str) and r:
        return r
    roles = payload.get("roles")
    if isinstance(roles, list) and roles:
        return str(roles[0])
    return ""


def _is_privileged(role: str) -> bool:
    rl = (role or "").lower()
    return rl in ("admin", "super_admin", "hr", "company_admin")


@router.get("/settings", response_model=APIResponse[TenantSettingsOut])
async def get_settings(request: Request, db: Session = Depends(get_db_session_dependency)):
    tenant_id = get_tenant_id(request)
    biz = AttendanceBusiness(db)
    return APIResponse.success_response(data=biz.get_settings(tenant_id))


@router.patch("/settings", response_model=APIResponse[TenantSettingsOut])
async def patch_settings(
    body: SettingsUpdateRequest,
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not _is_privileged(_user_role(user)):
        raise HTTPException(status_code=403, detail="Requires admin or HR role")
    tenant_id = get_tenant_id(request)
    biz = AttendanceBusiness(db)
    return APIResponse.success_response(
        data=biz.update_settings(tenant_id, body.enable_realtime_attendance),
        message="Settings updated",
    )


@router.post("/punch", response_model=APIResponse[AttendanceEventOut])
async def punch(
    body: PunchRequest,
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    tenant_id = get_tenant_id(request)
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    auth = request.headers.get("Authorization") or ""
    token = auth.split(" ", 1)[1] if auth.startswith("Bearer ") else ""

    biz = AttendanceBusiness(db)
    try:
        ev = await biz.punch(
            tenant_id=tenant_id,
            user_id=_user_uuid(user),
            user_email=_user_email(user),
            user_role=_user_role(user),
            client_ip=_client_ip(request),
            body=body,
            token=token,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return APIResponse.success_response(data=AttendanceEventOut.model_validate(ev), message="Event recorded")


@router.get("/my-events", response_model=APIResponse[list[AttendanceEventOut]])
async def my_events(
    request: Request,
    employee_id: UUID,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    db: Session = Depends(get_db_session_dependency),
):
    tenant_id = get_tenant_id(request)
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    auth = request.headers.get("Authorization") or ""
    token = auth.split(" ", 1)[1] if auth.startswith("Bearer ") else ""

    biz = AttendanceBusiness(db)
    if _is_privileged(_user_role(user)):
        pass
    else:
        ok = await biz.verify_employee_email(
            tenant_id, employee_id, _user_email(user), token
        )
        if not ok:
            raise HTTPException(status_code=403, detail="Employee does not match your account")

    rows = biz.my_events(tenant_id, employee_id, _parse_iso_dt(from_date), _parse_iso_dt(to_date))
    return APIResponse.success_response(data=rows)


@router.get("/company", response_model=APIResponse[list[AttendanceEventOut]])
async def company_events(
    request: Request,
    employee_id: Optional[UUID] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    db: Session = Depends(get_db_session_dependency),
):
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not _is_privileged(_user_role(user)):
        raise HTTPException(status_code=403, detail="Requires admin or HR role")
    tenant_id = get_tenant_id(request)
    biz = AttendanceBusiness(db)
    rows = biz.company_events(
        tenant_id, employee_id, _parse_iso_dt(from_date), _parse_iso_dt(to_date)
    )
    return APIResponse.success_response(data=rows)


@router.get("/session-summary", response_model=APIResponse[SessionSummaryResponse])
async def session_summary(
    request: Request,
    employee_id: UUID,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    db: Session = Depends(get_db_session_dependency),
):
    tenant_id = get_tenant_id(request)
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    auth = request.headers.get("Authorization") or ""
    token = auth.split(" ", 1)[1] if auth.startswith("Bearer ") else ""

    biz = AttendanceBusiness(db)
    if not _is_privileged(_user_role(user)):
        ok = await biz.verify_employee_email(
            tenant_id, employee_id, _user_email(user), token
        )
        if not ok:
            raise HTTPException(status_code=403, detail="Employee does not match your account")

    data = biz.session_summary(
        tenant_id, employee_id, _parse_iso_dt(from_date), _parse_iso_dt(to_date)
    )
    return APIResponse.success_response(data=data)
