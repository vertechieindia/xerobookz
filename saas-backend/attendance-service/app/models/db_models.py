"""SQLAlchemy models for attendance-service"""

from sqlalchemy import Column, String, DateTime, Float, Text, Boolean, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class TenantAttendanceSettings(Base):
    __tablename__ = "tenant_attendance_settings"

    tenant_id = Column(UUID(as_uuid=True), primary_key=True)
    enable_realtime_attendance = Column(Boolean, default=False, nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class AttendanceEvent(Base):
    __tablename__ = "attendance_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    event_type = Column(String(32), nullable=False)
    timestamp_utc = Column(DateTime(timezone=True), nullable=False)
    timestamp_local = Column(DateTime(timezone=False), nullable=False)
    timezone = Column(String(64), nullable=False, default="UTC")
    ip_address = Column(String(64), nullable=True)
    geo_latitude = Column(Float, nullable=True)
    geo_longitude = Column(Float, nullable=True)
    geo_address = Column(Text, nullable=True)
    source = Column(String(16), nullable=False, default="web")
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        Index("ix_attendance_tenant_employee", "tenant_id", "employee_id"),
        Index("ix_attendance_tenant_ts", "tenant_id", "timestamp_utc"),
    )


class AttendanceAuditLog(Base):
    __tablename__ = "attendance_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    employee_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(String(64), nullable=False)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
