"""Response schemas for MFA Service"""

from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class MFASetupResponse(BaseModel):
    """MFA setup response"""
    device_id: UUID
    qr_code_url: str
    secret_key: str  # Only shown once during setup
    backup_codes: List[str]  # Only shown once during setup


class MFADeviceResponse(BaseModel):
    """MFA device response"""
    id: UUID
    device_type: str
    device_name: Optional[str]
    is_active: bool
    is_verified: bool
    last_used_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class MFAVerifyResponse(BaseModel):
    """MFA verification response"""
    verified: bool
    session_token: Optional[str] = None
    message: str
