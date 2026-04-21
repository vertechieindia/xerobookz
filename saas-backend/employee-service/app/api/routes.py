"""API routes for employee-service - Extended for Enterprise HRIS"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id, get_current_user
from shared_libs.database.postgres import get_db_session, get_db_session_dependency

from ..schemas.request import (
    EmployeeCreate, EmployeeUpdate,
    CompensationBandCreate, EmployeeCompensationCreate,
    EmployeeBenefitCreate, PerformanceReviewCreate,
    EmployeeSkillCreate, GlobalProfileCreate,
    EmploymentHistoryCreate, JobArchitectureCreate,
    EmployeeInvitationCreate, EmployeeInvitationAccept
)
from ..schemas.response import (
    EmployeeResponse,
    CompensationBandResponse, EmployeeCompensationResponse,
    EmployeeBenefitResponse, PerformanceReviewResponse,
    EmployeeSkillResponse, GlobalProfileResponse,
    EmploymentHistoryResponse, JobArchitectureResponse
)
from ..services.business import EmployeeService

router = APIRouter(prefix="/employees", tags=["employees"])


# ========== EXISTING EMPLOYEE ENDPOINTS ==========

@router.post("", response_model=APIResponse[EmployeeResponse])
async def create_employee(
    emp_data: EmployeeCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create employee"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    employee = await service.create_employee(emp_data, tenant_id)
    return APIResponse.success_response(data=employee, message="Employee created")


@router.get("", response_model=APIResponse[list[EmployeeResponse]])
async def get_employees(
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get all employees"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    employees = await service.get_employees(tenant_id)
    return APIResponse.success_response(data=employees)


@router.get("/me", response_model=APIResponse[EmployeeResponse])
async def get_my_employee_record(
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    """Employee profile for the authenticated user (matched by email)."""
    tenant_id = get_tenant_id(request)
    user = get_current_user(request)
    if not user:
        return APIResponse.error_response("UNAUTHORIZED", "Authentication required")
    email = (user.get("email") or user.get("preferred_username") or "").strip()
    if not email:
        return APIResponse.error_response("BAD_REQUEST", "Token has no email claim")
    service = EmployeeService(db)
    employee = await service.get_employee_by_email(tenant_id, email)
    if not employee:
        return APIResponse.error_response("NOT_FOUND", "No employee profile linked to this account")
    return APIResponse.success_response(data=employee)


@router.get("/{id}", response_model=APIResponse[EmployeeResponse])
async def get_employee(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee by ID"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    employee = await service.get_employee_by_id(id, tenant_id)
    if not employee:
        return APIResponse.error_response("NOT_FOUND", "Employee not found")
    return APIResponse.success_response(data=employee)


@router.patch("/{id}", response_model=APIResponse[EmployeeResponse])
async def update_employee(
    id: UUID,
    emp_data: EmployeeUpdate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Update employee"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    employee = await service.update_employee(id, emp_data, tenant_id)
    if not employee:
        return APIResponse.error_response("NOT_FOUND", "Employee not found")
    return APIResponse.success_response(data=employee, message="Employee updated")


@router.get("/{id}/documents", response_model=APIResponse[list])
async def get_employee_documents(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee documents"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    docs = await service.get_employee_documents(id, tenant_id)
    return APIResponse.success_response(data=docs)


# ========== ENTERPRISE HRIS ENDPOINTS ==========

@router.post("/{id}/compensation", response_model=APIResponse[EmployeeCompensationResponse])
async def create_employee_compensation(
    id: UUID,
    comp_data: EmployeeCompensationCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create employee compensation record"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    compensation = await service.create_compensation(id, comp_data, tenant_id)
    return APIResponse.success_response(data=compensation, message="Compensation created")


@router.get("/{id}/compensation", response_model=APIResponse[list[EmployeeCompensationResponse]])
async def get_employee_compensation(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee compensation history"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    compensation = await service.get_employee_compensation(id, tenant_id)
    return APIResponse.success_response(data=compensation)


@router.get("/{id}/compensation/bands", response_model=APIResponse[list[CompensationBandResponse]])
async def get_compensation_bands_for_employee(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get available compensation bands for employee"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    bands = await service.get_compensation_bands_for_employee(id, tenant_id)
    return APIResponse.success_response(data=bands)


@router.post("/{id}/benefits", response_model=APIResponse[EmployeeBenefitResponse])
async def create_employee_benefit(
    id: UUID,
    benefit_data: EmployeeBenefitCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Enroll employee in benefit plan"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    benefit = await service.create_benefit(id, benefit_data, tenant_id)
    return APIResponse.success_response(data=benefit, message="Benefit enrollment created")


@router.get("/{id}/benefits", response_model=APIResponse[list[EmployeeBenefitResponse]])
async def get_employee_benefits(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee benefits"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    benefits = await service.get_employee_benefits(id, tenant_id)
    return APIResponse.success_response(data=benefits)


@router.post("/{id}/performance-reviews", response_model=APIResponse[PerformanceReviewResponse])
async def create_performance_review(
    id: UUID,
    review_data: PerformanceReviewCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create performance review"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    review = await service.create_performance_review(id, review_data, tenant_id)
    return APIResponse.success_response(data=review, message="Performance review created")


@router.get("/{id}/performance-reviews", response_model=APIResponse[list[PerformanceReviewResponse]])
async def get_employee_performance_reviews(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee performance reviews"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    reviews = await service.get_employee_performance_reviews(id, tenant_id)
    return APIResponse.success_response(data=reviews)


@router.post("/{id}/skills", response_model=APIResponse[EmployeeSkillResponse])
async def add_employee_skill(
    id: UUID,
    skill_data: EmployeeSkillCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Add skill to employee"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    skill = await service.add_employee_skill(id, skill_data, tenant_id)
    return APIResponse.success_response(data=skill, message="Skill added")


@router.get("/{id}/skills", response_model=APIResponse[list[EmployeeSkillResponse]])
async def get_employee_skills(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee skills"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    skills = await service.get_employee_skills(id, tenant_id)
    return APIResponse.success_response(data=skills)


@router.get("/{id}/global-profile", response_model=APIResponse[GlobalProfileResponse])
async def get_employee_global_profile(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee global HRIS profile"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    profile = await service.get_employee_global_profile(id, tenant_id)
    if not profile:
        return APIResponse.error_response("NOT_FOUND", "Global profile not found")
    return APIResponse.success_response(data=profile)


@router.post("/{id}/global-profile", response_model=APIResponse[GlobalProfileResponse])
async def create_employee_global_profile(
    id: UUID,
    profile_data: GlobalProfileCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create or update employee global HRIS profile"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    profile = await service.create_global_profile(id, profile_data, tenant_id)
    return APIResponse.success_response(data=profile, message="Global profile created")


@router.get("/{id}/employment-history", response_model=APIResponse[list[EmploymentHistoryResponse]])
async def get_employment_history(
    id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get employee employment history"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    history = await service.get_employment_history(id, tenant_id)
    return APIResponse.success_response(data=history)


@router.post("/{id}/employment-history", response_model=APIResponse[EmploymentHistoryResponse])
async def create_employment_history(
    id: UUID,
    history_data: EmploymentHistoryCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Add employment history record"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    history = await service.create_employment_history(id, history_data, tenant_id)
    return APIResponse.success_response(data=history, message="Employment history added")


# ========== COMPENSATION BANDS ENDPOINTS ==========

@router.post("/compensation-bands", response_model=APIResponse[CompensationBandResponse])
async def create_compensation_band(
    band_data: CompensationBandCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create compensation band"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    band = await service.create_compensation_band(band_data, tenant_id)
    return APIResponse.success_response(data=band, message="Compensation band created")


@router.get("/compensation-bands", response_model=APIResponse[list[CompensationBandResponse]])
async def get_compensation_bands(
    request: Request,
    job_code: str = None,
    country_code: str = None,
    db: Session = Depends(get_db_session)
):
    """Get compensation bands"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    bands = await service.get_compensation_bands(tenant_id, job_code, country_code)
    return APIResponse.success_response(data=bands)


# ========== JOB ARCHITECTURE ENDPOINTS ==========

@router.post("/job-architecture", response_model=APIResponse[JobArchitectureResponse])
async def create_job_architecture(
    job_data: JobArchitectureCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create job architecture entry"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    job = await service.create_job_architecture(job_data, tenant_id)
    return APIResponse.success_response(data=job, message="Job architecture created")


@router.get("/job-architecture", response_model=APIResponse[list[JobArchitectureResponse]])
async def get_job_architecture(
    request: Request,
    job_family: str = None,
    job_level: str = None,
    db: Session = Depends(get_db_session)
):
    """Get job architecture"""
    tenant_id = get_tenant_id(request)
    service = EmployeeService(db)
    jobs = await service.get_job_architecture(tenant_id, job_family, job_level)
    return APIResponse.success_response(data=jobs)


# ========== EMPLOYEE INVITATION ENDPOINTS ==========

@router.post("/invitations", response_model=APIResponse)
async def invite_employee(
    invitation_data: EmployeeInvitationCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Invite an employee"""
    from shared_libs.auth.middleware import get_current_user
    from shared_libs.models.enums import UserRole
    
    tenant_id = get_tenant_id(request)
    current_user = get_current_user(request)
    
    # Check if user has admin or hrbp role
    user_roles = current_user.get("roles", [])
    if not any(role in [UserRole.ADMIN.value, UserRole.HRBP.value] for role in user_roles):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and HRBPs can invite employees"
        )
    
    service = EmployeeService(db)
    result = await service.invite_employee(invitation_data, tenant_id, current_user.get("sub"))
    return APIResponse.success_response(data=result, message="Invitation sent successfully")


@router.post("/invitations/accept", response_model=APIResponse)
async def accept_invitation(
    accept_data: EmployeeInvitationAccept,
    db: Session = Depends(get_db_session)
):
    """Accept employee invitation"""
    service = EmployeeService(db)
    result = await service.accept_invitation(
        token=accept_data.token,
        password=accept_data.password,
        first_name=accept_data.first_name,
        last_name=accept_data.last_name
    )
    return APIResponse.success_response(data=result, message="Invitation accepted successfully")
