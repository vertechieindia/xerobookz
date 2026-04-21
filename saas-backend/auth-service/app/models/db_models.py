"""SQLAlchemy database models for auth-service"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Table, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

# Add shared-libs to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


# Association table for many-to-many relationship
user_roles_table = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True),
)


class Tenant(Base):
    """Tenant model"""
    
    __tablename__ = "tenants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=True, index=True)  # e.g. XB000016272 for login
    domain = Column(String(255), unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    users = relationship("TenantUser", back_populates="tenant")


class User(Base):
    """User model"""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    roles = relationship("Role", secondary=user_roles_table, back_populates="users")
    tenant_users = relationship("TenantUser", back_populates="user")


class Role(Base):
    """Role model"""
    
    __tablename__ = "roles"
    __table_args__ = (UniqueConstraint("name", "tenant_id", name="uq_role_name_tenant"),)
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    users = relationship("User", secondary=user_roles_table, back_populates="roles")
    permissions = relationship("Permission", back_populates="role")


class Permission(Base):
    """Permission model"""
    
    __tablename__ = "permissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    resource = Column(String(100), nullable=False)
    action = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    role = relationship("Role", back_populates="permissions")


class TenantUser(Base):
    """Tenant-User association"""
    
    __tablename__ = "tenant_users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    tenant = relationship("Tenant", back_populates="users")
    user = relationship("User", back_populates="tenant_users")

