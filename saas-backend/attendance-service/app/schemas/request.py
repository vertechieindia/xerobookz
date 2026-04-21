from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class PunchRequest(BaseModel):
    event_type: str = Field(..., pattern="^(PUNCH_IN|PUNCH_OUT|BREAK_IN|BREAK_OUT)$")
    employee_id: UUID
    geo_latitude: Optional[float] = None
    geo_longitude: Optional[float] = None
    geo_address: Optional[str] = None
    timezone: str = Field(default="UTC", max_length=64)
    source: str = Field(default="web", pattern="^(web|mobile)$")


class SettingsUpdateRequest(BaseModel):
    enable_realtime_attendance: bool
