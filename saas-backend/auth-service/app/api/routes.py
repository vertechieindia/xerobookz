"""API routes for auth-service"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id
from shared_libs.database.postgres import get_db_session_dependency

from ..schemas.request import UserCreate, UserLogin, RoleCreate, AssignRoleRequest, SignupRequest
from ..schemas.response import UserResponse, TokenResponse, RoleResponse, TenantUserSummary
from ..services.business import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db_session_dependency)
):
    """User login endpoint. tenant_id can be UUID or tenant code (e.g. XB000016272)."""
    service = AuthService(db)
    result = await service.login(
        email=login_data.email,
        password=login_data.password,
        tenant_id_or_code=login_data.tenant_id.strip(),
        mfa_code=login_data.mfa_code
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    return APIResponse.success_response(data=result, message="Login successful")


@router.post("/refresh", response_model=APIResponse[TokenResponse])
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db_session_dependency)
):
    """Refresh access token"""
    service = AuthService(db)
    result = await service.refresh_token(refresh_token)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    return APIResponse.success_response(data=result, message="Token refreshed")


@router.post("/signup", response_model=APIResponse)
async def signup(
    signup_data: SignupRequest,
    db: Session = Depends(get_db_session_dependency)
):
    """User signup - creates company and admin user"""
    service = AuthService(db)
    result = await service.signup(
        company_name=signup_data.company_name,
        email=signup_data.email,
        password=signup_data.password,
        promo_code=signup_data.promo_code
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signup failed"
        )
    
    return APIResponse.success_response(data=result, message="Account created successfully")


@router.post("/logout")
async def logout(
    token: str = Depends(security),
    db: Session = Depends(get_db_session_dependency)
):
    """User logout"""
    service = AuthService(db)
    await service.logout(token.credentials)
    return APIResponse.success_response(message="Logged out successfully")


@router.get("/me", response_model=APIResponse[UserResponse])
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db_session_dependency)
):
    """Get current user info"""
    from shared_libs.auth.middleware import get_current_user as get_user
    
    user_payload = get_user(request)
    if not user_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    service = AuthService(db)
    user = await service.get_user_by_id(UUID(user_payload.get("sub")))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return APIResponse.success_response(data=user, message="User retrieved")


@router.get("/roles", response_model=APIResponse[List[RoleResponse]])
async def get_roles(
    request: Request,
    db: Session = Depends(get_db_session_dependency)
):
    """Get all roles"""
    tenant_id = get_tenant_id(request)
    
    service = AuthService(db)
    roles = await service.get_roles(tenant_id)
    return APIResponse.success_response(data=roles, message="Roles retrieved")


@router.post("/roles", response_model=APIResponse[RoleResponse])
async def create_role(
    role_data: RoleCreate,
    request: Request,
    db: Session = Depends(get_db_session_dependency)
):
    """Create a new role"""
    tenant_id = get_tenant_id(request)
    
    service = AuthService(db)
    role = await service.create_role(
        name=role_data.name,
        description=role_data.description,
        tenant_id=role_data.tenant_id or tenant_id
    )
    
    return APIResponse.success_response(data=role, message="Role created")


@router.get("/tenant-users", response_model=APIResponse[List])
async def list_tenant_users(
    request: Request,
    db: Session = Depends(get_db_session_dependency)
):
    """List users in tenant (for company admin to assign Contract Team etc.)"""
    tenant_id = get_tenant_id(request)
    repo = AuthService(db).repo
    users = repo.get_tenant_users(tenant_id)
    return APIResponse.success_response(
        data=[TenantUserSummary(user_id=u["user_id"], email=u["email"], role_names=u["role_names"]) for u in users],
        message="OK",
    )


@router.post("/assign-role", response_model=APIResponse)
async def assign_role(
    assign_data: AssignRoleRequest,
    request: Request,
    db: Session = Depends(get_db_session_dependency)
):
    """Assign role to user"""
    tenant_id = get_tenant_id(request)
    
    service = AuthService(db)
    await service.assign_role(
        user_id=assign_data.user_id,
        role_id=assign_data.role_id,
        tenant_id=tenant_id
    )
    
    return APIResponse.success_response(message="Role assigned")


@router.post("/users", response_model=APIResponse[UserResponse])
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db_session_dependency)
):
    """Create a new user"""
    service = AuthService(db)
    user = await service.create_user(
        email=user_data.email,
        password=user_data.password,
        tenant_id=user_data.tenant_id
    )
    return APIResponse.success_response(data=user, message="User created")

