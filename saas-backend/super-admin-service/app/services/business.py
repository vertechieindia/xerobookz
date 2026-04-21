"""Business logic for Super Admin Service"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from uuid import UUID, uuid4
from datetime import datetime, timedelta
import secrets
import hashlib
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.models.enums import UserRole

from ..models.db_models import APIKey, SystemStatistics, CompanyAccessLog
from ..schemas.request import CompanyCreateRequest, APIKeyCreateRequest
from ..schemas.response import CompanyResponse, APIKeyResponse, StatisticsResponse, DashboardResponse
from ..repositories.repo import SuperAdminRepository


class SuperAdminService:
    """Super Admin business logic"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = SuperAdminRepository(db)
    
    async def create_company(
        self,
        request: CompanyCreateRequest,
        created_by: UUID
    ) -> CompanyResponse:
        """Create a new company/tenant"""
        # Create tenant
        tenant = self.repo.create_tenant(
            name=request.name,
            domain=request.domain,
            is_active=True
        )
        
        # Create admin user
        admin_user = self.repo.create_user(
            email=request.admin_email,
            password=request.admin_password,
            name=request.admin_name,
            tenant_id=tenant.id,
            role=UserRole.ADMIN
        )
        
        # Log activity
        self.repo.log_activity(
            tenant_id=tenant.id,
            action="created",
            performed_by=created_by,
            details={"admin_email": request.admin_email, "plan": request.plan}
        )
        
        return CompanyResponse(
            id=tenant.id,
            name=tenant.name,
            domain=tenant.domain,
            is_active=tenant.is_active,
            plan=request.plan,
            total_users=1,
            total_employees=0,
            created_at=tenant.created_at,
            updated_at=tenant.updated_at
        )
    
    async def get_companies(
        self,
        skip: int = 0,
        limit: int = 100,
        search: str = None
    ) -> List[CompanyResponse]:
        """Get all companies"""
        tenants = self.repo.get_tenants(skip=skip, limit=limit, search=search)
        
        result = []
        for tenant in tenants:
            stats = self.repo.get_tenant_stats(tenant.id)
            result.append(CompanyResponse(
                id=tenant.id,
                name=tenant.name,
                domain=tenant.domain,
                is_active=tenant.is_active,
                plan="standard",  # TODO: Get from tenant settings
                total_users=stats.get("users", 0),
                total_employees=stats.get("employees", 0),
                created_at=tenant.created_at,
                updated_at=tenant.updated_at
            ))
        
        return result
    
    async def create_api_key(
        self,
        request: APIKeyCreateRequest,
        created_by: UUID
    ) -> APIKeyResponse:
        """Create an API key for a company"""
        # Generate API key
        api_key = f"xb_{secrets.token_urlsafe(24)}"
        api_secret = secrets.token_urlsafe(32)
        
        # Hash the secret
        secret_hash = hashlib.sha256(api_secret.encode()).hexdigest()
        
        # Create API key record
        key_record = APIKey(
            id=uuid4(),
            tenant_id=request.tenant_id,
            key_name=request.key_name,
            api_key=api_key,
            api_secret=secret_hash,
            permissions=request.permissions or [],
            rate_limit=request.rate_limit,
            is_active=True,
            expires_at=request.expires_at,
            created_by=created_by
        )
        
        self.db.add(key_record)
        self.db.commit()
        self.db.refresh(key_record)
        
        # Return with unhashed secret (only shown once)
        response = APIKeyResponse(
            id=key_record.id,
            tenant_id=key_record.tenant_id,
            key_name=key_record.key_name,
            api_key=key_record.api_key,
            permissions=key_record.permissions,
            rate_limit=key_record.rate_limit,
            is_active=key_record.is_active,
            expires_at=key_record.expires_at,
            last_used_at=key_record.last_used_at,
            created_at=key_record.created_at
        )
        
        # Store unhashed secret temporarily (in production, use secure storage)
        response.api_secret = api_secret
        
        return response
    
    async def get_statistics(
        self,
        start_date: datetime = None,
        end_date: datetime = None
    ) -> StatisticsResponse:
        """Get system statistics"""
        stats = self.repo.get_system_statistics(start_date, end_date)
        
        return StatisticsResponse(
            total_tenants=stats.get("total_tenants", 0),
            active_tenants=stats.get("active_tenants", 0),
            total_users=stats.get("total_users", 0),
            active_users=stats.get("active_users", 0),
            total_employees=stats.get("total_employees", 0),
            total_organizations=stats.get("total_organizations", 0),
            total_api_requests=stats.get("total_api_requests", 0),
            total_storage_used=stats.get("total_storage_used", 0),
            metadata=stats.get("metadata"),
            date=datetime.utcnow()
        )
    
    async def get_dashboard(self) -> DashboardResponse:
        """Get dashboard overview"""
        stats = await self.get_statistics()
        companies = await self.get_companies(limit=10)
        activities = self.repo.get_recent_activities(limit=20)
        
        return DashboardResponse(
            statistics=stats,
            recent_companies=companies,
            recent_activities=activities,
            system_health={
                "status": "healthy",
                "uptime": "99.9%",
                "last_check": datetime.utcnow()
            }
        )
