"""Database models for MFA Service"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class MFADevice(Base):
    """MFA device registration"""
    
    __tablename__ = "mfa_devices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    device_type = Column(String(50), nullable=False)  # totp, sms, email, push
    device_name = Column(String(255), nullable=True)  # "John's iPhone", "Google Authenticator"
    secret_key = Column(String(255), nullable=False)  # Encrypted TOTP secret
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class MFABackupCode(Base):
    """MFA backup codes"""
    
    __tablename__ = "mfa_backup_codes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    code_hash = Column(String(255), nullable=False)  # Hashed backup code
    is_used = Column(Boolean, default=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())


class MFASession(Base):
    """MFA verification session"""
    
    __tablename__ = "mfa_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    session_token = Column(String(255), unique=True, nullable=False, index=True)
    device_id = Column(UUID(as_uuid=True), ForeignKey("mfa_devices.id"), nullable=True)
    is_verified = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())
