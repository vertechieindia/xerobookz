"""Database models for employee-service - Extended with Enterprise HRIS"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, Date, Enum as SQLEnum, Numeric, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class Employee(Base):
    """Employee model - Extended with HRIS fields"""
    
    __tablename__ = "employees"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_number = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    hire_date = Column(Date, nullable=True)
    termination_date = Column(Date, nullable=True)
    status = Column(String(50), default="active")  # active, terminated, on_leave
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True)
    manager_id = Column(UUID(as_uuid=True), nullable=True)
    job_title = Column(String(255), nullable=True)
    location_id = Column(UUID(as_uuid=True), nullable=True)
    
    # HRIS Extended Fields
    job_code = Column(String(50), nullable=True)
    job_family = Column(String(100), nullable=True)
    employment_type = Column(String(50), nullable=True)  # full_time, part_time, contractor
    employee_class = Column(String(50), nullable=True)  # regular, intern, temp
    cost_center = Column(String(50), nullable=True)
    business_unit = Column(String(100), nullable=True)
    division = Column(String(100), nullable=True)
    country_code = Column(String(3), nullable=True)  # ISO country code
    timezone = Column(String(50), nullable=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    work_auth = relationship("EmployeeWorkAuth", back_populates="employee")
    documents = relationship("EmployeeDocument", back_populates="employee")
    history = relationship("EmployeeHistory", back_populates="employee")
    compensation = relationship("EmployeeCompensation", back_populates="employee")
    benefits = relationship("EmployeeBenefit", back_populates="employee")
    performance_reviews = relationship("EmployeePerformanceReview", back_populates="employee")
    global_profile = relationship("EmployeeGlobalProfile", back_populates="employee", uselist=False)
    skills = relationship("EmployeeSkill", back_populates="employee")
    employment_history = relationship("EmploymentHistory", back_populates="employee")


class EmployeeWorkAuth(Base):
    """Employee work authorization"""
    
    __tablename__ = "employee_work_auth"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    work_auth_type = Column(String(50), nullable=False)  # us_citizen, permanent_resident, h1b, etc.
    work_auth_number = Column(String(100), nullable=True)
    expiration_date = Column(Date, nullable=True)
    immigration_case_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    employee = relationship("Employee", back_populates="work_auth")


class EmployeeDocument(Base):
    """Employee document reference"""
    
    __tablename__ = "employee_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    document_id = Column(UUID(as_uuid=True), nullable=False)  # Reference to document-service
    document_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    employee = relationship("Employee", back_populates="documents")


class EmployeeHistory(Base):
    """Employee history/audit log"""
    
    __tablename__ = "employee_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    action = Column(String(100), nullable=False)
    changes = Column(Text, nullable=True)  # JSON string
    changed_by = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    employee = relationship("Employee", back_populates="history")


# ========== ENTERPRISE HRIS MODELS ==========

class CompensationBand(Base):
    """Compensation bands for job architecture"""
    
    __tablename__ = "compensation_bands"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    job_code = Column(String(50), nullable=False)
    job_family = Column(String(100), nullable=True)
    band_level = Column(String(50), nullable=False)  # entry, mid, senior, executive
    country_code = Column(String(3), nullable=False)
    currency = Column(String(3), default="USD")
    min_salary = Column(Numeric(12, 2), nullable=True)
    max_salary = Column(Numeric(12, 2), nullable=True)
    mid_point = Column(Numeric(12, 2), nullable=True)
    effective_date = Column(Date, nullable=False)
    expiration_date = Column(Date, nullable=True)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class EmployeeCompensation(Base):
    """Employee compensation records"""
    
    __tablename__ = "employee_compensation"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    compensation_band_id = Column(UUID(as_uuid=True), ForeignKey("compensation_bands.id"), nullable=True)
    base_salary = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(3), default="USD")
    pay_frequency = Column(String(20), nullable=True)  # monthly, biweekly, weekly
    effective_date = Column(Date, nullable=False)
    expiration_date = Column(Date, nullable=True)
    bonus_target = Column(Numeric(12, 2), nullable=True)
    equity_grants = Column(Text, nullable=True)  # JSON
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    employee = relationship("Employee", back_populates="compensation")


class EmployeeBenefit(Base):
    """Employee benefits enrollment"""
    
    __tablename__ = "employee_benefits"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    benefit_plan_id = Column(UUID(as_uuid=True), nullable=False)  # Reference to organization-service
    enrollment_date = Column(Date, nullable=False)
    coverage_start_date = Column(Date, nullable=False)
    coverage_end_date = Column(Date, nullable=True)
    status = Column(String(50), default="active")
    dependents_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    employee = relationship("Employee", back_populates="benefits")


class EmployeePerformanceReview(Base):
    """Employee performance reviews"""
    
    __tablename__ = "employee_performance_reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), nullable=False)
    review_cycle_id = Column(UUID(as_uuid=True), nullable=True)  # Reference to workflow-service
    review_type = Column(String(50), nullable=False)  # annual, mid_year, quarterly, 1on1
    review_period_start = Column(Date, nullable=False)
    review_period_end = Column(Date, nullable=False)
    overall_rating = Column(String(50), nullable=True)
    review_data = Column(JSON, nullable=True)  # Full review data
    status = Column(String(50), default="draft")  # draft, in_progress, completed
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    employee = relationship("Employee", back_populates="performance_reviews")


class EmployeeGlobalProfile(Base):
    """Global HRIS profile - country-specific fields"""
    
    __tablename__ = "employee_global_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, unique=True)
    country_code = Column(String(3), nullable=False)
    local_employee_id = Column(String(100), nullable=True)  # Country-specific ID
    tax_id = Column(String(100), nullable=True)
    social_security_number = Column(String(100), nullable=True)
    national_id = Column(String(100), nullable=True)
    local_address = Column(Text, nullable=True)  # JSON
    local_phone = Column(String(20), nullable=True)
    local_emergency_contact = Column(JSON, nullable=True)
    local_compliance_data = Column(JSON, nullable=True)  # Country-specific compliance fields
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    employee = relationship("Employee", back_populates="global_profile")


class EmployeeSkill(Base):
    """Employee skills inventory"""
    
    __tablename__ = "employee_skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    skill_name = Column(String(200), nullable=False)
    skill_category = Column(String(100), nullable=True)
    proficiency_level = Column(String(50), nullable=True)  # beginner, intermediate, advanced, expert
    years_of_experience = Column(Integer, nullable=True)
    verified = Column(Boolean, default=False)
    verified_by = Column(UUID(as_uuid=True), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    employee = relationship("Employee", back_populates="skills")


class EmploymentHistory(Base):
    """Employment history - previous positions within company"""
    
    __tablename__ = "employment_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    job_title = Column(String(255), nullable=False)
    department_id = Column(UUID(as_uuid=True), nullable=True)
    manager_id = Column(UUID(as_uuid=True), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    reason_for_change = Column(String(200), nullable=True)
    promotion = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    employee = relationship("Employee", back_populates="employment_history")


class JobArchitecture(Base):
    """Job architecture - job codes, families, levels"""
    
    __tablename__ = "job_architecture"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    job_code = Column(String(50), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_family = Column(String(100), nullable=True)
    job_level = Column(String(50), nullable=True)  # entry, mid, senior, executive
    job_category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class EmployeeInvitation(Base):
    """Employee invitation model"""
    
    __tablename__ = "employee_invitations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    job_title = Column(String(255), nullable=True)
    department_id = Column(UUID(as_uuid=True), nullable=True)
    invitation_token = Column(String(255), unique=True, nullable=False, index=True)
    invited_by = Column(UUID(as_uuid=True), nullable=False)  # Company admin user ID
    status = Column(String(50), default="pending")  # pending, accepted, expired, cancelled
    expires_at = Column(DateTime, nullable=False)
    accepted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
