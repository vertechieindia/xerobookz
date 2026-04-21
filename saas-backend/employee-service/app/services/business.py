"""Business logic for employee-service - Extended for Enterprise HRIS"""

from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
import sys
import os
import secrets
import bcrypt
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.models.enums import EventType
from shared_libs.schemas.events import EventEnvelope

from ..models.db_models import Employee, EmployeeInvitation
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
from ..repositories.repo import EmployeeRepository
from ..events.producers import EventProducer


class EmployeeService:
    """Employee service - Extended for Enterprise HRIS"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = EmployeeRepository(db)
        self.event_producer = EventProducer()
    
    # ========== EXISTING EMPLOYEE METHODS ==========
    
    async def create_employee(
        self,
        data: EmployeeCreate,
        tenant_id: UUID
    ) -> EmployeeResponse:
        """Create employee"""
        employee = self.repo.create_employee(data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.EMPLOYEE_CREATED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee.id), "employee_number": employee.employee_number}
        )
        await self.event_producer.publish(event)
        
        return EmployeeResponse.model_validate(employee)
    
    async def get_employees(self, tenant_id: UUID) -> list[EmployeeResponse]:
        """Get all employees"""
        employees = self.repo.get_employees(tenant_id)
        return [EmployeeResponse.model_validate(e) for e in employees]
    
    async def get_employee_by_id(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> EmployeeResponse | None:
        """Get employee by ID"""
        employee = self.repo.get_employee_by_id(employee_id, tenant_id)
        if not employee:
            return None
        return EmployeeResponse.model_validate(employee)
    
    async def update_employee(
        self,
        employee_id: UUID,
        data: EmployeeUpdate,
        tenant_id: UUID
    ) -> EmployeeResponse | None:
        """Update employee"""
        employee = self.repo.update_employee(employee_id, data, tenant_id)
        if not employee:
            return None
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.EMPLOYEE_UPDATED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee.id)}
        )
        await self.event_producer.publish(event)
        
        return EmployeeResponse.model_validate(employee)
    
    async def get_employee_documents(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list:
        """Get employee documents"""
        return self.repo.get_employee_documents(employee_id, tenant_id)
    
    # ========== ENTERPRISE HRIS METHODS ==========
    
    async def create_compensation_band(
        self,
        data: CompensationBandCreate,
        tenant_id: UUID
    ) -> CompensationBandResponse:
        """Create compensation band"""
        band = self.repo.create_compensation_band(data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.COMPENSATION_UPDATED,
            tenant_id=tenant_id,
            payload={"compensation_band_id": str(band.id), "job_code": band.job_code}
        )
        await self.event_producer.publish(event)
        
        return CompensationBandResponse.model_validate(band)
    
    async def get_compensation_bands(
        self,
        tenant_id: UUID,
        job_code: str | None = None,
        country_code: str | None = None
    ) -> list[CompensationBandResponse]:
        """Get compensation bands"""
        bands = self.repo.get_compensation_bands(tenant_id, job_code, country_code)
        return [CompensationBandResponse.model_validate(b) for b in bands]
    
    async def get_compensation_bands_for_employee(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[CompensationBandResponse]:
        """Get compensation bands for employee"""
        bands = self.repo.get_compensation_bands_for_employee(employee_id, tenant_id)
        return [CompensationBandResponse.model_validate(b) for b in bands]
    
    async def create_compensation(
        self,
        employee_id: UUID,
        data: EmployeeCompensationCreate,
        tenant_id: UUID
    ) -> EmployeeCompensationResponse:
        """Create employee compensation"""
        comp = self.repo.create_employee_compensation(employee_id, data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.COMPENSATION_UPDATED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee_id), "compensation_id": str(comp.id)}
        )
        await self.event_producer.publish(event)
        
        return EmployeeCompensationResponse.model_validate(comp)
    
    async def get_employee_compensation(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[EmployeeCompensationResponse]:
        """Get employee compensation history"""
        comps = self.repo.get_employee_compensation(employee_id, tenant_id)
        return [EmployeeCompensationResponse.model_validate(c) for c in comps]
    
    async def create_benefit(
        self,
        employee_id: UUID,
        data: EmployeeBenefitCreate,
        tenant_id: UUID
    ) -> EmployeeBenefitResponse:
        """Create employee benefit enrollment"""
        benefit = self.repo.create_employee_benefit(employee_id, data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.BENEFIT_ENROLLED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee_id), "benefit_id": str(benefit.id)}
        )
        await self.event_producer.publish(event)
        
        return EmployeeBenefitResponse.model_validate(benefit)
    
    async def get_employee_benefits(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[EmployeeBenefitResponse]:
        """Get employee benefits"""
        benefits = self.repo.get_employee_benefits(employee_id, tenant_id)
        return [EmployeeBenefitResponse.model_validate(b) for b in benefits]
    
    async def create_performance_review(
        self,
        employee_id: UUID,
        data: PerformanceReviewCreate,
        tenant_id: UUID
    ) -> PerformanceReviewResponse:
        """Create performance review"""
        review = self.repo.create_performance_review(employee_id, data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.PERFORMANCE_REVIEW_CREATED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee_id), "review_id": str(review.id)}
        )
        await self.event_producer.publish(event)
        
        return PerformanceReviewResponse.model_validate(review)
    
    async def get_employee_performance_reviews(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[PerformanceReviewResponse]:
        """Get employee performance reviews"""
        reviews = self.repo.get_employee_performance_reviews(employee_id, tenant_id)
        return [PerformanceReviewResponse.model_validate(r) for r in reviews]
    
    async def add_employee_skill(
        self,
        employee_id: UUID,
        data: EmployeeSkillCreate,
        tenant_id: UUID
    ) -> EmployeeSkillResponse:
        """Add employee skill"""
        skill = self.repo.add_employee_skill(employee_id, data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.SKILL_ADDED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee_id), "skill_id": str(skill.id)}
        )
        await self.event_producer.publish(event)
        
        return EmployeeSkillResponse.model_validate(skill)
    
    async def get_employee_skills(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[EmployeeSkillResponse]:
        """Get employee skills"""
        skills = self.repo.get_employee_skills(employee_id, tenant_id)
        return [EmployeeSkillResponse.model_validate(s) for s in skills]
    
    async def get_employee_global_profile(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> GlobalProfileResponse | None:
        """Get employee global profile"""
        profile = self.repo.get_employee_global_profile(employee_id, tenant_id)
        if not profile:
            return None
        return GlobalProfileResponse.model_validate(profile)
    
    async def create_global_profile(
        self,
        employee_id: UUID,
        data: GlobalProfileCreate,
        tenant_id: UUID
    ) -> GlobalProfileResponse:
        """Create or update global profile"""
        profile = self.repo.create_global_profile(employee_id, data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.GLOBAL_PROFILE_UPDATED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee_id), "profile_id": str(profile.id)}
        )
        await self.event_producer.publish(event)
        
        return GlobalProfileResponse.model_validate(profile)
    
    async def get_employment_history(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[EmploymentHistoryResponse]:
        """Get employment history"""
        history = self.repo.get_employment_history(employee_id, tenant_id)
        return [EmploymentHistoryResponse.model_validate(h) for h in history]
    
    async def create_employment_history(
        self,
        employee_id: UUID,
        data: EmploymentHistoryCreate,
        tenant_id: UUID
    ) -> EmploymentHistoryResponse:
        """Create employment history record"""
        history = self.repo.create_employment_history(employee_id, data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.EMPLOYMENT_HISTORY_UPDATED,
            tenant_id=tenant_id,
            payload={"employee_id": str(employee_id), "history_id": str(history.id)}
        )
        await self.event_producer.publish(event)
        
        return EmploymentHistoryResponse.model_validate(history)
    
    async def create_job_architecture(
        self,
        data: JobArchitectureCreate,
        tenant_id: UUID
    ) -> JobArchitectureResponse:
        """Create job architecture entry"""
        job = self.repo.create_job_architecture(data, tenant_id)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.EMPLOYEE_UPDATED,  # Using generic event for job architecture
            tenant_id=tenant_id,
            payload={"job_architecture_id": str(job.id), "job_code": job.job_code}
        )
        await self.event_producer.publish(event)
        
        return JobArchitectureResponse.model_validate(job)
    
    async def get_job_architecture(
        self,
        tenant_id: UUID,
        job_family: str | None = None,
        job_level: str | None = None
    ) -> list[JobArchitectureResponse]:
        """Get job architecture"""
        jobs = self.repo.get_job_architecture(tenant_id, job_family, job_level)
        return [JobArchitectureResponse.model_validate(j) for j in jobs]
    
    # ========== EMPLOYEE INVITATION METHODS ==========
    
    async def invite_employee(
        self,
        data: EmployeeInvitationCreate,
        tenant_id: UUID,
        invited_by: str
    ) -> dict:
        """Invite an employee"""
        # Generate invitation token
        token = secrets.token_urlsafe(32)
        
        # Create invitation (expires in 7 days)
        invitation = EmployeeInvitation(
            tenant_id=tenant_id,
            email=data.email,
            first_name=data.first_name,
            last_name=data.last_name,
            job_title=data.job_title,
            department_id=data.department_id,
            invitation_token=token,
            invited_by=UUID(invited_by),
            status="pending",
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        
        self.db.add(invitation)
        self.db.commit()
        self.db.refresh(invitation)
        
        # TODO: Send invitation email with token
        # For now, return the invitation details
        
        return {
            "invitation_id": str(invitation.id),
            "email": invitation.email,
            "token": token,  # In production, send via email only
            "expires_at": invitation.expires_at.isoformat()
        }
    
    async def accept_invitation(
        self,
        token: str,
        password: str,
        first_name: str,
        last_name: str
    ) -> dict:
        """Accept employee invitation"""
        # Find invitation
        invitation = self.db.query(EmployeeInvitation).filter(
            EmployeeInvitation.invitation_token == token,
            EmployeeInvitation.status == "pending"
        ).first()
        
        if not invitation:
            raise ValueError("Invalid or expired invitation")
        
        if invitation.expires_at < datetime.utcnow():
            invitation.status = "expired"
            self.db.commit()
            raise ValueError("Invitation has expired")
        
        # Create user account via auth-service
        async with httpx.AsyncClient() as client:
            user_response = await client.post(
                "http://auth-service:8001/api/v1/auth/users",
                json={
                    "email": invitation.email,
                    "password": password,
                    "tenant_id": str(invitation.tenant_id)
                }
            )
            
            if user_response.status_code != 200:
                raise ValueError("Failed to create user account")
            
            user_data = user_response.json()
            user_id = user_data.get("data", {}).get("id")
        
        # Create employee record
        employee = Employee(
            tenant_id=invitation.tenant_id,
            employee_number=f"EMP-{secrets.token_hex(4).upper()}",
            first_name=first_name,
            last_name=last_name,
            email=invitation.email,
            job_title=invitation.job_title,
            department_id=invitation.department_id,
            status="active"
        )
        
        self.db.add(employee)
        
        # Mark invitation as accepted
        invitation.status = "accepted"
        invitation.accepted_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(employee)
        
        # Publish event
        event = EventEnvelope(
            event_type=EventType.EMPLOYEE_CREATED,
            tenant_id=invitation.tenant_id,
            payload={"employee_id": str(employee.id), "employee_number": employee.employee_number}
        )
        await self.event_producer.publish(event)
        
        return {
            "employee_id": str(employee.id),
            "email": employee.email,
            "status": "accepted"
        }
