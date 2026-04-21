"""Response schemas for timesheet-service - Extended for Enterprise"""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date, time


class AttendanceRecordResponse(BaseModel):
    """Attendance record response"""
    id: UUID
    tenant_id: UUID
    employee_id: UUID
    clock_in: datetime
    clock_out: Optional[datetime]
    location: Optional[str]
    hours_worked: Optional[str]
    overtime_hours: str
    record_source: str = "manual"
    created_at: datetime
    
    class Config:
        from_attributes = True


class ScheduleResponse(BaseModel):
    """Schedule response"""
    id: UUID
    tenant_id: UUID
    employee_id: UUID
    start_time: time
    end_time: time
    day_of_week: int
    is_recurring: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ShiftResponse(BaseModel):
    """Shift response"""
    id: UUID
    tenant_id: UUID
    employee_id: UUID
    shift_date: date
    start_time: time
    end_time: time
    break_duration: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

