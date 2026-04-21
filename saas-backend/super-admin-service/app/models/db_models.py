"""Database models for Super Admin Service"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class APIKey(Base):
    """API Key model for companies"""
    
    __tablename__ = "api_keys"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    key_name = Column(String(255), nullable=False)
    api_key = Column(String(255), unique=True, nullable=False, index=True)
    api_secret = Column(String(255), nullable=False)
    permissions = Column(JSON, nullable=True)  # List of allowed endpoints
    rate_limit = Column(Integer, default=1000)  # Requests per hour
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)
    last_used_at = Column(DateTime, nullable=True)
    created_by = Column(UUID(as_uuid=True), nullable=False)  # Super admin user ID
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class SystemStatistics(Base):
    """System-wide statistics"""
    
    __tablename__ = "system_statistics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    stat_date = Column(DateTime, default=func.now(), nullable=False, index=True)
    total_tenants = Column(Integer, default=0)
    active_tenants = Column(Integer, default=0)
    total_users = Column(Integer, default=0)
    active_users = Column(Integer, default=0)
    total_employees = Column(Integer, default=0)
    total_organizations = Column(Integer, default=0)
    total_api_requests = Column(Integer, default=0)
    total_storage_used = Column(Integer, default=0)  # in bytes
    metadata = Column(JSON, nullable=True)  # Additional stats
    created_at = Column(DateTime, default=func.now())


class CompanyAccessLog(Base):
    """Log of company access and activities"""
    
    __tablename__ = "company_access_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    action = Column(String(100), nullable=False)  # created, updated, deleted, accessed
    performed_by = Column(UUID(as_uuid=True), nullable=False)  # Super admin user ID
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), index=True)
