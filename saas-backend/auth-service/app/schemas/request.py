"""Request schemas"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID


class UserCreate(BaseModel):
    """User creation schema"""
    
    email: EmailStr
    password: str = Field(..., min_length=8)
    tenant_id: UUID


class UserLogin(BaseModel):
    """User login schema - tenant_id can be UUID or tenant code (e.g. XB000016272)."""
    
    email: EmailStr
    password: str
    tenant_id: str  # UUID string or tenant code
    mfa_code: Optional[str] = None


class RoleCreate(BaseModel):
    """Role creation schema"""
    
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    tenant_id: Optional[UUID] = None


class AssignRoleRequest(BaseModel):
    """Assign role to user"""
    
    user_id: UUID
    role_id: UUID


class SignupRequest(BaseModel):
    """User signup schema"""
    
    company_name: str
    email: EmailStr
    password: str = Field(..., min_length=8)
    promo_code: Optional[str] = None

