"""API routes for timesheet-service - Extended for Enterprise"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id
from shared_libs.database.postgres import get_db_session

from ..schemas.request import (
    AttendanceClockInRequest,
    AttendanceClockOutRequest,
    RealtimeCloseRequest,
    ScheduleCreate,
    ShiftCreate,
)
from ..schemas.response import AttendanceRecordResponse, ScheduleResponse, ShiftResponse
from ..services.business import TimesheetService

router = APIRouter(prefix="/timesheet", tags=["timesheet"])


# ========== ENTERPRISE: TIME & ATTENDANCE ENDPOINTS ==========

@router.post("/attendance/clock-in", response_model=APIResponse[AttendanceRecordResponse])
async def clock_in(
    clock_in_data: AttendanceClockInRequest,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Clock in"""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    record = await service.clock_in(clock_in_data, tenant_id)
    return APIResponse.success_response(data=record, message="Clocked in")


@router.post("/attendance/clock-out", response_model=APIResponse[AttendanceRecordResponse])
async def clock_out(
    clock_out_data: AttendanceClockOutRequest,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Clock out"""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    record = await service.clock_out(clock_out_data.attendance_record_id, tenant_id)
    if not record:
        return APIResponse.error_response("NOT_FOUND", "Attendance record not found")
    return APIResponse.success_response(data=record, message="Clocked out")


@router.post("/attendance/realtime-close", response_model=APIResponse[AttendanceRecordResponse])
async def attendance_realtime_close(
    body: RealtimeCloseRequest,
    request: Request,
    db: Session = Depends(get_db_session),
):
    """Upsert timesheet row when a real-time punch session closes (optional auto-fill)."""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    record = await service.record_realtime_session(body, tenant_id)
    return APIResponse.success_response(data=record, message="Timesheet updated from attendance")


@router.get("/attendance/records", response_model=APIResponse[list[AttendanceRecordResponse]])
async def get_attendance_records(
    request: Request,
    employee_id: UUID = None,
    db: Session = Depends(get_db_session)
):
    """Get attendance records"""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    records = await service.get_attendance_records(tenant_id, employee_id)
    return APIResponse.success_response(data=records)


@router.post("/schedules", response_model=APIResponse[ScheduleResponse])
async def create_schedule(
    schedule_data: ScheduleCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create schedule"""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    schedule = await service.create_schedule(schedule_data, tenant_id)
    return APIResponse.success_response(data=schedule, message="Schedule created")


@router.get("/schedules", response_model=APIResponse[list[ScheduleResponse]])
async def get_schedules(
    request: Request,
    employee_id: UUID = None,
    db: Session = Depends(get_db_session)
):
    """Get schedules"""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    schedules = await service.get_schedules(tenant_id, employee_id)
    return APIResponse.success_response(data=schedules)


@router.post("/shifts", response_model=APIResponse[ShiftResponse])
async def create_shift(
    shift_data: ShiftCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create shift"""
    tenant_id = get_tenant_id(request)
    service = TimesheetService(db)
    shift = await service.create_shift(shift_data, tenant_id)
    return APIResponse.success_response(data=shift, message="Shift created")
