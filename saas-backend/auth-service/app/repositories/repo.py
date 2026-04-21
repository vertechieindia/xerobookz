"""Repository for auth-service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID
import bcrypt
from typing import Optional

from ..models.db_models import User, Role, TenantUser, Tenant


class AuthRepository:
    """Authentication repository"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_tenant_user(self, user_id: UUID, tenant_id: UUID) -> Optional[TenantUser]:
        """Get tenant-user association"""
        return self.db.query(TenantUser).filter(
            and_(
                TenantUser.user_id == user_id,
                TenantUser.tenant_id == tenant_id
            )
        ).first()
    
    def get_roles_by_tenant(self, tenant_id: UUID) -> list[Role]:
        """Get roles for tenant"""
        return self.db.query(Role).filter(
            Role.tenant_id == tenant_id
        ).all()
    
    def create_role(
        self,
        name: str,
        description: str = None,
        tenant_id: UUID = None
    ) -> Role:
        """Create a new role"""
        role = Role(
            name=name,
            description=description,
            tenant_id=tenant_id
        )
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role
    
    def assign_role_to_user(
        self,
        user_id: UUID,
        role_id: UUID,
        tenant_id: UUID
    ):
        """Assign role to user"""
        # Check if user belongs to tenant
        tenant_user = self.get_tenant_user(user_id, tenant_id)
        if not tenant_user:
            raise ValueError("User does not belong to tenant")
        
        # Get user and role
        user = self.get_user_by_id(user_id)
        role = self.db.query(Role).filter(Role.id == role_id).first()
        
        if not user or not role:
            raise ValueError("User or role not found")
        
        # Add role to user
        if role not in user.roles:
            user.roles.append(role)
            self.db.commit()
    
    def get_tenant_by_code(self, code: str) -> Optional[Tenant]:
        """Get tenant by human-readable code (e.g. XB000016272)."""
        return self.db.query(Tenant).filter(Tenant.code == code).first()

    def create_tenant(
        self, name: str, domain: str = None, is_active: bool = True, code: str = None
    ) -> Tenant:
        """Create a new tenant"""
        tenant = Tenant(
            name=name,
            domain=domain,
            is_active=is_active,
            code=code,
        )
        self.db.add(tenant)
        self.db.commit()
        self.db.refresh(tenant)
        return tenant
    
    def get_role_by_name(self, name: str, tenant_id: UUID) -> Optional[Role]:
        """Get role by name for tenant"""
        return self.db.query(Role).filter(
            and_(
                Role.name == name,
                Role.tenant_id == tenant_id
            )
        ).first()

    def get_tenant_users(self, tenant_id: UUID) -> list:
        """Get all users in tenant (User with role names) for admin assignment."""
        from sqlalchemy.orm import joinedload
        tenant_users = (
            self.db.query(TenantUser)
            .filter(TenantUser.tenant_id == tenant_id, TenantUser.is_active == True)
            .options(joinedload(TenantUser.user).joinedload(User.roles))
            .all()
        )
        return [
            {
                "user_id": tu.user_id,
                "email": tu.user.email,
                "role_names": [r.name for r in tu.user.roles],
            }
            for tu in tenant_users
        ]

