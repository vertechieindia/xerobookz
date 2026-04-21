"""Request schemas for MFA Service"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID


class MFASetupRequest(BaseModel):
    """Request to setup MFA"""
    device_type: str  # totp, sms, email
    device_name: Optional[str] = None


class MFAVerifyRequest(BaseModel):
    """Request to verify MFA code"""
    code: str
    session_token: Optional[str] = None
    device_id: Optional[UUID] = None


class MFABackupCodeRequest(BaseModel):
    """Request to use backup code"""
    backup_code: str
    session_token: Optional[str] = None


class MFADeviceDeleteRequest(BaseModel):
    """Request to delete MFA device"""
    device_id: UUID
