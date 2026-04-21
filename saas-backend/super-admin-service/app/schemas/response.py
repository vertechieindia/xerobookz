"""Response schemas for Super Admin Service"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class CompanyResponse(BaseModel):
    """Company/tenant response"""
    id: UUID
    name: str
    domain: Optional[str]
    is_active: bool
    plan: str
    total_users: int
    total_employees: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class APIKeyResponse(BaseModel):
    """API Key response"""
    id: UUID
    tenant_id: UUID
    key_name: str
    api_key: str  # Only shown once on creation
    permissions: Optional[List[str]]
    rate_limit: int
    is_active: bool
    expires_at: Optional[datetime]
    last_used_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class StatisticsResponse(BaseModel):
    """Statistics response"""
    total_tenants: int
    active_tenants: int
    total_users: int
    active_users: int
    total_employees: int
    total_organizations: int
    total_api_requests: int
    total_storage_used: int
    metadata: Optional[Dict[str, Any]]
    date: datetime


class DashboardResponse(BaseModel):
    """Dashboard overview response"""
    statistics: StatisticsResponse
    recent_companies: List[CompanyResponse]
    recent_activities: List[Dict[str, Any]]
    system_health: Dict[str, Any]
