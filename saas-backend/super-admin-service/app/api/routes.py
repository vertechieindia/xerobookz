"""API routes for Super Admin Service"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_current_user, require_role
from shared_libs.models.enums import UserRole
from shared_libs.database.postgres import get_db_session

from ..schemas.request import (
    CompanyCreateRequest,
    CompanyUpdateRequest,
    APIKeyCreateRequest,
    APIKeyUpdateRequest,
    StatisticsFilterRequest
)
from ..schemas.response import (
    CompanyResponse,
    APIKeyResponse,
    StatisticsResponse,
    DashboardResponse
)
from ..services.business import SuperAdminService

router = APIRouter(prefix="/super-admin", tags=["super-admin"])


@router.get("/dashboard", response_model=APIResponse[DashboardResponse])
async def get_dashboard(
    db: Session = Depends(get_db_session),
    current_user = Depends(lambda: require_role(get_current_user, [UserRole.SUPER_ADMIN]))
):
    """Get super admin dashboard"""
    service = SuperAdminService(db)
    dashboard = await service.get_dashboard()
    return APIResponse.success_response(data=dashboard, message="Dashboard retrieved successfully")


@router.post("/companies", response_model=APIResponse[CompanyResponse])
async def create_company(
    request: CompanyCreateRequest,
    db: Session = Depends(get_db_session),
    current_user = Depends(lambda: require_role(get_current_user, [UserRole.SUPER_ADMIN]))
):
    """Create a new company/tenant"""
    service = SuperAdminService(db)
    company = await service.create_company(request, current_user.id)
    return APIResponse.success_response(data=company, message="Company created successfully")


@router.get("/companies", response_model=APIResponse[list[CompanyResponse]])
async def get_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: str = Query(None),
    db: Session = Depends(get_db_session),
    current_user = Depends(lambda: require_role(get_current_user, [UserRole.SUPER_ADMIN]))
):
    """Get all companies"""
    service = SuperAdminService(db)
    companies = await service.get_companies(skip=skip, limit=limit, search=search)
    return APIResponse.success_response(data=companies, message="Companies retrieved successfully")


@router.get("/statistics", response_model=APIResponse[StatisticsResponse])
async def get_statistics(
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db_session),
    current_user = Depends(lambda: require_role(get_current_user, [UserRole.SUPER_ADMIN]))
):
    """Get system statistics"""
    from datetime import datetime
    
    service = SuperAdminService(db)
    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None
    
    stats = await service.get_statistics(start_date=start, end_date=end)
    return APIResponse.success_response(data=stats, message="Statistics retrieved successfully")


@router.post("/api-keys", response_model=APIResponse[APIKeyResponse])
async def create_api_key(
    request: APIKeyCreateRequest,
    db: Session = Depends(get_db_session),
    current_user = Depends(lambda: require_role(get_current_user, [UserRole.SUPER_ADMIN]))
):
    """Create an API key for a company"""
    service = SuperAdminService(db)
    api_key = await service.create_api_key(request, current_user.id)
    return APIResponse.success_response(data=api_key, message="API key created successfully")
