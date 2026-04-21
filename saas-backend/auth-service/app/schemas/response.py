"""Response schemas"""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserResponse(BaseModel):
    """User response schema"""
    
    id: UUID
    email: str
    is_active: bool
    is_verified: bool
    mfa_enabled: bool
    created_at: datetime
    updated_at: datetime
    role: Optional[str] = None  # Primary role for UI (first role)
    roles: Optional[list[str]] = None  # All role names for access checks
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Token response schema"""
    
    access_token: str
    refresh_token: str
    expires_in: int
    user_role: Optional[str] = None  # Added for role-based routing
    mfa_required: Optional[bool] = False  # MFA requirement flag


class RoleResponse(BaseModel):
    """Role response schema"""
    
    id: UUID
    name: str
    description: Optional[str]
    tenant_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TenantUserSummary(BaseModel):
    """Tenant user for admin role assignment"""
    user_id: UUID
    email: str
    role_names: list[str] = []
