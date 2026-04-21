"""Request schemas for Super Admin Service"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class CompanyCreateRequest(BaseModel):
    """Request to create a new company/tenant"""
    name: str
    domain: Optional[str] = None
    admin_email: EmailStr
    admin_name: str
    admin_password: str
    plan: str = "standard"  # standard, premium, enterprise
    settings: Optional[Dict[str, Any]] = None


class CompanyUpdateRequest(BaseModel):
    """Request to update a company"""
    name: Optional[str] = None
    domain: Optional[str] = None
    is_active: Optional[bool] = None
    plan: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class APIKeyCreateRequest(BaseModel):
    """Request to create an API key"""
    tenant_id: UUID
    key_name: str
    permissions: Optional[List[str]] = None
    rate_limit: int = 1000
    expires_at: Optional[datetime] = None


class APIKeyUpdateRequest(BaseModel):
    """Request to update an API key"""
    key_name: Optional[str] = None
    permissions: Optional[List[str]] = None
    rate_limit: Optional[int] = None
    is_active: Optional[bool] = None
    expires_at: Optional[datetime] = None


class StatisticsFilterRequest(BaseModel):
    """Request to filter statistics"""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    tenant_id: Optional[UUID] = None
