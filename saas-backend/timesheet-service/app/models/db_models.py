"""Database models for timesheet-service"""

from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey, Date, Time, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class BaseModel(Base):
    """Base model with tenant support"""
    __abstract__ = True
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


# ========== ENTERPRISE: TIME & ATTENDANCE MODELS ==========

class AttendanceRecord(BaseModel):
    """Attendance record model"""
    
    __tablename__ = "attendance_records"
    
    employee_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    clock_in = Column(DateTime, nullable=False)
    clock_out = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    hours_worked = Column(String(10), nullable=True)
    overtime_hours = Column(String(10), default="0")
    # manual | attendance — coexists with real-time punch sessions
    record_source = Column(String(32), nullable=False, default="manual")


class Schedule(BaseModel):
    """Schedule model"""
    
    __tablename__ = "schedules"
    
    employee_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    is_recurring = Column(Boolean, default=True)


class Shift(BaseModel):
    """Shift model"""
    
    __tablename__ = "shifts"
    
    employee_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    shift_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    break_duration = Column(Integer, default=0)  # minutes
    status = Column(String(50), default="scheduled")  # scheduled, in_progress, completed, cancelled
