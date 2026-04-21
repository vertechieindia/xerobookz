from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class AttendanceEventOut(BaseModel):
    id: UUID
    tenant_id: UUID
    employee_id: UUID
    user_id: Optional[UUID]
    event_type: str
    timestamp_utc: datetime
    timestamp_local: datetime
    timezone: str
    ip_address: Optional[str]
    geo_latitude: Optional[float]
    geo_longitude: Optional[float]
    geo_address: Optional[str]
    source: str
    created_at: datetime

    class Config:
        from_attributes = True


class TenantSettingsOut(BaseModel):
    tenant_id: UUID
    enable_realtime_attendance: bool


class SessionSummaryItem(BaseModel):
    session_start_utc: datetime
    session_end_utc: Optional[datetime]
    work_seconds: int
    break_seconds: int
    event_count: int


class SessionSummaryResponse(BaseModel):
    employee_id: UUID
    sessions: List[SessionSummaryItem]
