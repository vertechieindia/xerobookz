from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional, Tuple
from uuid import UUID
import httpx
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from sqlalchemy.orm import Session

from ..repositories.repo import AttendanceRepository
from ..models.db_models import AttendanceEvent
from ..schemas.request import PunchRequest
from ..schemas.response import AttendanceEventOut, SessionSummaryItem, SessionSummaryResponse, TenantSettingsOut
from .state_machine import EventType, session_events_after_last_punch_out, validate_next_event, compute_state
from ..config import settings


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _to_local(ts_utc: datetime, tz_name: str) -> datetime:
    try:
        zi = ZoneInfo(tz_name or "UTC")
    except ZoneInfoNotFoundError:
        zi = ZoneInfo("UTC")
    if ts_utc.tzinfo is None:
        ts_utc = ts_utc.replace(tzinfo=timezone.utc)
    return ts_utc.astimezone(zi).replace(tzinfo=None)


def _session_event_types(events: List[AttendanceEvent]) -> List[EventType]:
    pairs = [(e.event_type, e.timestamp_utc) for e in sorted(events, key=lambda x: x.timestamp_utc)]
    typed = [(EventType(t), ts) for t, ts in pairs]
    return [e for e, _ in session_events_after_last_punch_out(typed)]


def _split_sessions(events: List[AttendanceEvent]) -> List[List[AttendanceEvent]]:
    """Split chronological events into sessions (each ends with PUNCH_OUT). Last may be open."""
    ordered = sorted(events, key=lambda x: x.timestamp_utc)
    sessions: List[List[AttendanceEvent]] = []
    cur: List[AttendanceEvent] = []
    for ev in ordered:
        cur.append(ev)
        if ev.event_type == EventType.PUNCH_OUT.value:
            sessions.append(cur)
            cur = []
    if cur:
        sessions.append(cur)
    return sessions


def _session_durations(session_events: List[AttendanceEvent]) -> Tuple[int, int]:
    """Return (work_seconds, break_seconds) for one session."""
    ordered = sorted(session_events, key=lambda x: x.timestamp_utc)
    punch_in = next((e for e in ordered if e.event_type == EventType.PUNCH_IN.value), None)
    punch_out = next((e for e in reversed(ordered) if e.event_type == EventType.PUNCH_OUT.value), None)
    if not punch_in:
        return 0, 0
    end = punch_out.timestamp_utc if punch_out else ordered[-1].timestamp_utc
    gross = (end - punch_in.timestamp_utc).total_seconds()
    break_secs = 0
    open_break_in: Optional[datetime] = None
    for ev in ordered:
        if ev.event_type == EventType.BREAK_IN.value:
            open_break_in = ev.timestamp_utc
        elif ev.event_type == EventType.BREAK_OUT.value and open_break_in:
            break_secs += int((ev.timestamp_utc - open_break_in).total_seconds())
            open_break_in = None
    work = int(gross - break_secs)
    return max(work, 0), int(break_secs)


class AttendanceBusiness:
    def __init__(self, db: Session):
        self.repo = AttendanceRepository(db)
        self.db = db

    def is_enabled(self, tenant_id: UUID) -> bool:
        row = self.repo.get_settings(tenant_id)
        return bool(row and row.enable_realtime_attendance)

    def get_settings(self, tenant_id: UUID) -> TenantSettingsOut:
        row = self.repo.get_settings(tenant_id)
        en = bool(row.enable_realtime_attendance) if row else False
        return TenantSettingsOut(tenant_id=tenant_id, enable_realtime_attendance=en)

    def update_settings(self, tenant_id: UUID, enable: bool) -> TenantSettingsOut:
        self.repo.upsert_settings(tenant_id, enable)
        return self.get_settings(tenant_id)

    async def verify_employee(self, tenant_id: UUID, employee_id: UUID, token: str) -> bool:
        url = f"{settings.EMPLOYEE_SERVICE_URL}/api/v1/employees/{employee_id}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r = await client.get(
                    url,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "X-Tenant-ID": str(tenant_id),
                    },
                )
                return r.status_code == 200
        except Exception:
            return False

    async def verify_employee_email(self, tenant_id: UUID, employee_id: UUID, email: str, token: str) -> bool:
        ok = await self.verify_employee(tenant_id, employee_id, token)
        if not ok:
            return False
        url = f"{settings.EMPLOYEE_SERVICE_URL}/api/v1/employees/{employee_id}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                r = await client.get(
                    url,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "X-Tenant-ID": str(tenant_id),
                    },
                )
                if r.status_code != 200:
                    return False
                data = r.json()
                emp_email = (data.get("data") or {}).get("email") or data.get("email")
                return emp_email and emp_email.lower() == email.lower()
        except Exception:
            return False

    async def punch(
        self,
        tenant_id: UUID,
        user_id: UUID,
        user_email: str,
        user_role: str,
        client_ip: Optional[str],
        body: PunchRequest,
        token: str,
    ) -> AttendanceEvent:
        if not self.is_enabled(tenant_id):
            raise ValueError("Real-time attendance is disabled for this organization")

        role_l = (user_role or "").lower()
        if role_l in ("employee",):
            ok = await self.verify_employee_email(tenant_id, body.employee_id, user_email, token)
            if not ok:
                raise PermissionError("Employee record does not match your account")
        else:
            if not await self.verify_employee(tenant_id, body.employee_id, token):
                raise ValueError("Employee not found")

        all_for_emp = self.repo.list_events(tenant_id, body.employee_id)
        session_types = _session_event_types(all_for_emp)
        next_t = EventType(body.event_type)
        validate_next_event(session_types, next_t)

        ts_utc = _utc_now()
        ts_local = _to_local(ts_utc, body.timezone)

        ev = AttendanceEvent(
            tenant_id=tenant_id,
            employee_id=body.employee_id,
            user_id=user_id,
            event_type=body.event_type,
            timestamp_utc=ts_utc,
            timestamp_local=ts_local,
            timezone=body.timezone,
            ip_address=client_ip,
            geo_latitude=body.geo_latitude,
            geo_longitude=body.geo_longitude,
            geo_address=body.geo_address,
            source=body.source,
        )
        self.repo.insert_event(ev)
        self.repo.audit(
            tenant_id,
            user_id,
            body.employee_id,
            "PUNCH",
            f"{body.event_type} at {ts_utc.isoformat()}",
        )

        if body.event_type == EventType.PUNCH_OUT.value:
            await self._sync_timesheet_if_possible(tenant_id, body.employee_id, token)

        return ev

    async def _sync_timesheet_if_possible(self, tenant_id: UUID, employee_id: UUID, token: str):
        events = self.repo.list_events(tenant_id, employee_id)
        sessions = _split_sessions(events)
        if not sessions:
            return
        last = sessions[-1]
        if not any(e.event_type == EventType.PUNCH_OUT.value for e in last):
            return
        work_s, break_s = _session_durations(last)
        punch_in = next(e for e in sorted(last, key=lambda x: x.timestamp_utc) if e.event_type == EventType.PUNCH_IN.value)
        punch_out = next(e for e in sorted(last, key=lambda x: x.timestamp_utc, reverse=True) if e.event_type == EventType.PUNCH_OUT.value)
        payload = {
            "employee_id": str(employee_id),
            "clock_in": punch_in.timestamp_utc.isoformat(),
            "clock_out": punch_out.timestamp_utc.isoformat(),
            "hours_worked": str(round(work_s / 3600.0, 2)),
            "timesheet_source": "attendance",
        }
        url = f"{settings.TIMESHEET_SERVICE_URL}/api/v1/timesheets/timesheet/attendance/realtime-close"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                await client.post(
                    url,
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "X-Tenant-ID": str(tenant_id),
                        "Content-Type": "application/json",
                    },
                )
        except Exception:
            pass

    def my_events(self, tenant_id: UUID, employee_id: UUID, from_utc=None, to_utc=None) -> List[AttendanceEventOut]:
        rows = self.repo.list_events(tenant_id, employee_id, from_utc, to_utc)
        return [AttendanceEventOut.model_validate(r) for r in rows]

    def company_events(
        self,
        tenant_id: UUID,
        employee_id: Optional[UUID],
        from_utc,
        to_utc,
    ) -> List[AttendanceEventOut]:
        rows = self.repo.list_events(tenant_id, employee_id, from_utc, to_utc)
        return [AttendanceEventOut.model_validate(r) for r in rows]

    def session_summary(
        self,
        tenant_id: UUID,
        employee_id: UUID,
        from_utc=None,
        to_utc=None,
    ) -> SessionSummaryResponse:
        rows = self.repo.list_events(tenant_id, employee_id, from_utc, to_utc)
        sessions = _split_sessions(rows)
        items: List[SessionSummaryItem] = []
        for sess in sessions:
            w, b = _session_durations(sess)
            ordered = sorted(sess, key=lambda x: x.timestamp_utc)
            start = ordered[0].timestamp_utc
            end_ev = next((e for e in reversed(ordered) if e.event_type == EventType.PUNCH_OUT.value), None)
            items.append(
                SessionSummaryItem(
                    session_start_utc=start,
                    session_end_utc=end_ev.timestamp_utc if end_ev else None,
                    work_seconds=w,
                    break_seconds=b,
                    event_count=len(sess),
                )
            )
        return SessionSummaryResponse(employee_id=employee_id, sessions=items)
