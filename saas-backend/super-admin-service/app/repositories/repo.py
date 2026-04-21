"""Repository layer for Super Admin Service"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from uuid import UUID
from datetime import datetime
import bcrypt
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base
from shared_libs.models.enums import UserRole

# Import models from auth-service
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../auth-service"))
from app.models.db_models import Tenant, User, Role, TenantUser


class SuperAdminRepository:
    """Repository for super admin operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_tenant(self, name: str, domain: str = None, is_active: bool = True) -> Tenant:
        """Create a new tenant"""
        tenant = Tenant(
            name=name,
            domain=domain,
            is_active=is_active
        )
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant
    
    def create_user(
        self,
        email: str,
        password: str,
        name: str,
        tenant_id: UUID,
        role: UserRole
    ) -> User:
        """Create a user with role"""
        # Hash password
        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        
        # Create user
        user = User(
            email=email,
            password_hash=password_hash,
            is_active=True,
            is_verified=True
        )
        self.db.add(user)
        self.db.flush()
        
        # Get or create role
        role_obj = self.db.query(Role).filter(
            Role.name == role.value,
            Role.tenant_id == tenant_id
        ).first()
        
        if not role_obj:
            role_obj = Role(
                name=role.value,
                description=f"{role.value} role",
                tenant_id=tenant_id
            )
            self.db.add(role_obj)
            self.db.flush()
        
        # Associate user with role
        user.roles.append(role_obj)
        
        # Create tenant-user association
        tenant_user = TenantUser(
            tenant_id=tenant_id,
            user_id=user.id,
            is_active=True
        )
        self.db.add(tenant_user)
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_tenants(self, skip: int = 0, limit: int = 100, search: str = None):
        """Get all tenants"""
        query = self.db.query(Tenant)
        
        if search:
            query = query.filter(
                or_(
                    Tenant.name.ilike(f"%{search}%"),
                    Tenant.domain.ilike(f"%{search}%")
                )
            )
        
        return query.order_by(desc(Tenant.created_at)).offset(skip).limit(limit).all()
    
    def get_tenant_stats(self, tenant_id: UUID) -> dict:
        """Get statistics for a tenant"""
        # Count users
        user_count = self.db.query(func.count(TenantUser.user_id)).filter(
            TenantUser.tenant_id == tenant_id,
            TenantUser.is_active == True
        ).scalar() or 0
        
        # TODO: Count employees from employee-service
        employee_count = 0
        
        return {
            "users": user_count,
            "employees": employee_count
        }
    
    def get_system_statistics(
        self,
        start_date: datetime = None,
        end_date: datetime = None
    ) -> dict:
        """Get system-wide statistics"""
        # Count tenants
        total_tenants = self.db.query(func.count(Tenant.id)).scalar() or 0
        active_tenants = self.db.query(func.count(Tenant.id)).filter(
            Tenant.is_active == True
        ).scalar() or 0
        
        # Count users
        total_users = self.db.query(func.count(User.id)).scalar() or 0
        active_users = self.db.query(func.count(User.id)).filter(
            User.is_active == True
        ).scalar() or 0
        
        # TODO: Get from other services
        total_employees = 0
        total_organizations = 0
        total_api_requests = 0
        total_storage_used = 0
        
        return {
            "total_tenants": total_tenants,
            "active_tenants": active_tenants,
            "total_users": total_users,
            "active_users": active_users,
            "total_employees": total_employees,
            "total_organizations": total_organizations,
            "total_api_requests": total_api_requests,
            "total_storage_used": total_storage_used,
            "metadata": {}
        }
    
    def log_activity(
        self,
        tenant_id: UUID,
        action: str,
        performed_by: UUID,
        details: dict = None,
        ip_address: str = None,
        user_agent: str = None
    ):
        """Log an activity"""
        from ..models.db_models import CompanyAccessLog
        
        log = CompanyAccessLog(
            tenant_id=tenant_id,
            action=action,
            performed_by=performed_by,
            details=details or {},
            ip_address=ip_address,
            user_agent=user_agent
        )
        self.db.add(log)
        self.db.commit()
    
    def get_recent_activities(self, limit: int = 20) -> list:
        """Get recent activities"""
        from ..models.db_models import CompanyAccessLog
        
        activities = self.db.query(CompanyAccessLog).order_by(
            desc(CompanyAccessLog.created_at)
        ).limit(limit).all()
        
        return [
            {
                "id": str(act.id),
                "tenant_id": str(act.tenant_id),
                "action": act.action,
                "performed_by": str(act.performed_by),
                "details": act.details,
                "created_at": act.created_at.isoformat()
            }
            for act in activities
        ]
