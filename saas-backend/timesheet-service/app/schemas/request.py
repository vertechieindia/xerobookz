"""Request schemas for timesheet-service - Extended for Enterprise"""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import time


class AttendanceClockInRequest(BaseModel):
    """Clock in request"""
    employee_id: UUID
    location: Optional[str] = None


class AttendanceClockOutRequest(BaseModel):
    """Clock out request"""
    employee_id: UUID
    attendance_record_id: UUID


class RealtimeCloseRequest(BaseModel):
    """Closed real-time attendance session → optional timesheet row (source = attendance)."""

    employee_id: UUID
    clock_in: str
    clock_out: str
    hours_worked: str
    timesheet_source: str = "attendance"  # manual | attendance


class ScheduleCreate(BaseModel):
    """Create schedule"""
    employee_id: UUID
    start_time: str  # HH:MM format
    end_time: str  # HH:MM format
    day_of_week: int  # 0=Monday, 6=Sunday
    is_recurring: bool = True


class ShiftCreate(BaseModel):
    """Create shift"""
    employee_id: UUID
    shift_date: str  # ISO date string
    start_time: str  # HH:MM format
    end_time: str  # HH:MM format
    break_duration: int = 0  # minutes

