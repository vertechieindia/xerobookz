"""Request schemas - Extended for Enterprise HRIS"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import date
from decimal import Decimal


class EmployeeCreate(BaseModel):
    employee_number: str
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    job_title: Optional[str] = None
    location_id: Optional[UUID] = None
    # HRIS Extended Fields
    job_code: Optional[str] = None
    job_family: Optional[str] = None
    employment_type: Optional[str] = None
    employee_class: Optional[str] = None
    cost_center: Optional[str] = None
    business_unit: Optional[str] = None
    division: Optional[str] = None
    country_code: Optional[str] = None
    timezone: Optional[str] = None


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    status: Optional[str] = None
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    job_title: Optional[str] = None
    location_id: Optional[UUID] = None
    # HRIS Extended Fields
    job_code: Optional[str] = None
    job_family: Optional[str] = None
    employment_type: Optional[str] = None
    employee_class: Optional[str] = None
    cost_center: Optional[str] = None
    business_unit: Optional[str] = None
    division: Optional[str] = None
    country_code: Optional[str] = None
    timezone: Optional[str] = None


# ========== ENTERPRISE HRIS REQUEST SCHEMAS ==========

class CompensationBandCreate(BaseModel):
    job_code: str
    job_family: Optional[str] = None
    band_level: str
    country_code: str
    currency: str = "USD"
    min_salary: Optional[Decimal] = None
    max_salary: Optional[Decimal] = None
    mid_point: Optional[Decimal] = None
    effective_date: date
    expiration_date: Optional[date] = None


class EmployeeCompensationCreate(BaseModel):
    employee_id: UUID
    compensation_band_id: Optional[UUID] = None
    base_salary: Optional[Decimal] = None
    currency: str = "USD"
    pay_frequency: Optional[str] = None
    effective_date: date
    expiration_date: Optional[date] = None
    bonus_target: Optional[Decimal] = None
    equity_grants: Optional[Dict[str, Any]] = None


class EmployeeBenefitCreate(BaseModel):
    employee_id: UUID
    benefit_plan_id: UUID
    enrollment_date: date
    coverage_start_date: date
    coverage_end_date: Optional[date] = None
    dependents_count: int = 0


class PerformanceReviewCreate(BaseModel):
    employee_id: UUID
    reviewer_id: UUID
    review_cycle_id: Optional[UUID] = None
    review_type: str
    review_period_start: date
    review_period_end: date
    overall_rating: Optional[str] = None
    review_data: Optional[Dict[str, Any]] = None


class EmployeeSkillCreate(BaseModel):
    employee_id: UUID
    skill_name: str
    skill_category: Optional[str] = None
    proficiency_level: Optional[str] = None
    years_of_experience: Optional[int] = None


class GlobalProfileCreate(BaseModel):
    employee_id: UUID
    country_code: str
    local_employee_id: Optional[str] = None
    tax_id: Optional[str] = None
    social_security_number: Optional[str] = None
    national_id: Optional[str] = None
    local_address: Optional[Dict[str, Any]] = None
    local_phone: Optional[str] = None
    local_emergency_contact: Optional[Dict[str, Any]] = None
    local_compliance_data: Optional[Dict[str, Any]] = None


class EmploymentHistoryCreate(BaseModel):
    employee_id: UUID
    job_title: str
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    start_date: date
    end_date: Optional[date] = None
    reason_for_change: Optional[str] = None
    promotion: bool = False


class JobArchitectureCreate(BaseModel):
    job_code: str
    job_title: str
    job_family: Optional[str] = None
    job_level: Optional[str] = None
    job_category: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None


class EmployeeInvitationCreate(BaseModel):
    """Employee invitation request"""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    department_id: Optional[UUID] = None


class EmployeeInvitationAccept(BaseModel):
    """Employee invitation acceptance"""
    token: str
    password: str
    first_name: str
    last_name: str
