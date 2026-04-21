"""Repository for employee-service - Extended for Enterprise HRIS"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from uuid import UUID
from typing import Optional, List

from ..models.db_models import (
    Employee, EmployeeDocument,
    CompensationBand, EmployeeCompensation,
    EmployeeBenefit, EmployeePerformanceReview,
    EmployeeGlobalProfile, EmployeeSkill,
    EmploymentHistory, JobArchitecture
)
from ..schemas.request import (
    EmployeeCreate, EmployeeUpdate,
    CompensationBandCreate, EmployeeCompensationCreate,
    EmployeeBenefitCreate, PerformanceReviewCreate,
    EmployeeSkillCreate, GlobalProfileCreate,
    EmploymentHistoryCreate, JobArchitectureCreate
)


class EmployeeRepository:
    """Employee repository - Extended for Enterprise HRIS"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ========== EXISTING EMPLOYEE METHODS ==========
    
    def create_employee(
        self,
        data: EmployeeCreate,
        tenant_id: UUID
    ) -> Employee:
        """Create employee"""
        employee = Employee(
            tenant_id=tenant_id,
            employee_number=data.employee_number,
            first_name=data.first_name,
            last_name=data.last_name,
            email=data.email,
            phone=data.phone,
            hire_date=data.hire_date,
            department_id=data.department_id,
            manager_id=data.manager_id,
            job_title=data.job_title,
            location_id=data.location_id,
            job_code=data.job_code,
            job_family=data.job_family,
            employment_type=data.employment_type,
            employee_class=data.employee_class,
            cost_center=data.cost_center,
            business_unit=data.business_unit,
            division=data.division,
            country_code=data.country_code,
            timezone=data.timezone
        )
        self.db.add(employee)
        self.db.commit()
        self.db.refresh(employee)
        return employee
    
    def get_employees(self, tenant_id: UUID) -> list[Employee]:
        """Get all employees for tenant"""
        return self.db.query(Employee).filter(
            Employee.tenant_id == tenant_id
        ).all()
    
    def get_employee_by_id(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> Optional[Employee]:
        """Get employee by ID"""
        return self.db.query(Employee).filter(
            and_(
                Employee.id == employee_id,
                Employee.tenant_id == tenant_id
            )
        ).first()

    def get_employee_by_email(self, tenant_id: UUID, email: str) -> Optional[Employee]:
        """Resolve employee row by email (case-insensitive) within tenant."""
        email = (email or "").strip()
        if not email:
            return None
        return (
            self.db.query(Employee)
            .filter(
                Employee.tenant_id == tenant_id,
                func.lower(Employee.email) == email.lower(),
            )
            .first()
        )
    
    def update_employee(
        self,
        employee_id: UUID,
        data: EmployeeUpdate,
        tenant_id: UUID
    ) -> Optional[Employee]:
        """Update employee"""
        employee = self.get_employee_by_id(employee_id, tenant_id)
        if not employee:
            return None
        
        # Update basic fields
        if data.first_name is not None:
            employee.first_name = data.first_name
        if data.last_name is not None:
            employee.last_name = data.last_name
        if data.email is not None:
            employee.email = data.email
        if data.phone is not None:
            employee.phone = data.phone
        if data.hire_date is not None:
            employee.hire_date = data.hire_date
        if data.termination_date is not None:
            employee.termination_date = data.termination_date
        if data.status is not None:
            employee.status = data.status
        if data.department_id is not None:
            employee.department_id = data.department_id
        if data.manager_id is not None:
            employee.manager_id = data.manager_id
        if data.job_title is not None:
            employee.job_title = data.job_title
        if data.location_id is not None:
            employee.location_id = data.location_id
        
        # Update HRIS fields
        if data.job_code is not None:
            employee.job_code = data.job_code
        if data.job_family is not None:
            employee.job_family = data.job_family
        if data.employment_type is not None:
            employee.employment_type = data.employment_type
        if data.employee_class is not None:
            employee.employee_class = data.employee_class
        if data.cost_center is not None:
            employee.cost_center = data.cost_center
        if data.business_unit is not None:
            employee.business_unit = data.business_unit
        if data.division is not None:
            employee.division = data.division
        if data.country_code is not None:
            employee.country_code = data.country_code
        if data.timezone is not None:
            employee.timezone = data.timezone
        
        self.db.commit()
        self.db.refresh(employee)
        return employee
    
    def get_employee_documents(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> list[EmployeeDocument]:
        """Get employee documents"""
        return self.db.query(EmployeeDocument).filter(
            and_(
                EmployeeDocument.employee_id == employee_id,
                EmployeeDocument.tenant_id == tenant_id
            )
        ).all()
    
    # ========== ENTERPRISE HRIS METHODS ==========
    
    def create_compensation_band(
        self,
        data: CompensationBandCreate,
        tenant_id: UUID
    ) -> CompensationBand:
        """Create compensation band"""
        band = CompensationBand(
            tenant_id=tenant_id,
            job_code=data.job_code,
            job_family=data.job_family,
            band_level=data.band_level,
            country_code=data.country_code,
            currency=data.currency,
            min_salary=data.min_salary,
            max_salary=data.max_salary,
            mid_point=data.mid_point,
            effective_date=data.effective_date,
            expiration_date=data.expiration_date
        )
        self.db.add(band)
        self.db.commit()
        self.db.refresh(band)
        return band
    
    def get_compensation_bands(
        self,
        tenant_id: UUID,
        job_code: Optional[str] = None,
        country_code: Optional[str] = None
    ) -> List[CompensationBand]:
        """Get compensation bands"""
        query = self.db.query(CompensationBand).filter(
            CompensationBand.tenant_id == tenant_id
        )
        if job_code:
            query = query.filter(CompensationBand.job_code == job_code)
        if country_code:
            query = query.filter(CompensationBand.country_code == country_code)
        return query.all()
    
    def create_employee_compensation(
        self,
        employee_id: UUID,
        data: EmployeeCompensationCreate,
        tenant_id: UUID
    ) -> EmployeeCompensation:
        """Create employee compensation"""
        comp = EmployeeCompensation(
            tenant_id=tenant_id,
            employee_id=employee_id,
            compensation_band_id=data.compensation_band_id,
            base_salary=data.base_salary,
            currency=data.currency,
            pay_frequency=data.pay_frequency,
            effective_date=data.effective_date,
            expiration_date=data.expiration_date,
            bonus_target=data.bonus_target,
            equity_grants=str(data.equity_grants) if data.equity_grants else None
        )
        self.db.add(comp)
        self.db.commit()
        self.db.refresh(comp)
        return comp
    
    def get_employee_compensation(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> List[EmployeeCompensation]:
        """Get employee compensation history"""
        return self.db.query(EmployeeCompensation).filter(
            and_(
                EmployeeCompensation.employee_id == employee_id,
                EmployeeCompensation.tenant_id == tenant_id
            )
        ).order_by(EmployeeCompensation.effective_date.desc()).all()
    
    def create_employee_benefit(
        self,
        employee_id: UUID,
        data: EmployeeBenefitCreate,
        tenant_id: UUID
    ) -> EmployeeBenefit:
        """Create employee benefit enrollment"""
        benefit = EmployeeBenefit(
            tenant_id=tenant_id,
            employee_id=employee_id,
            benefit_plan_id=data.benefit_plan_id,
            enrollment_date=data.enrollment_date,
            coverage_start_date=data.coverage_start_date,
            coverage_end_date=data.coverage_end_date,
            dependents_count=data.dependents_count
        )
        self.db.add(benefit)
        self.db.commit()
        self.db.refresh(benefit)
        return benefit
    
    def get_employee_benefits(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> List[EmployeeBenefit]:
        """Get employee benefits"""
        return self.db.query(EmployeeBenefit).filter(
            and_(
                EmployeeBenefit.employee_id == employee_id,
                EmployeeBenefit.tenant_id == tenant_id
            )
        ).all()
    
    def create_performance_review(
        self,
        employee_id: UUID,
        data: PerformanceReviewCreate,
        tenant_id: UUID
    ) -> EmployeePerformanceReview:
        """Create performance review"""
        review = EmployeePerformanceReview(
            tenant_id=tenant_id,
            employee_id=employee_id,
            reviewer_id=data.reviewer_id,
            review_cycle_id=data.review_cycle_id,
            review_type=data.review_type,
            review_period_start=data.review_period_start,
            review_period_end=data.review_period_end,
            overall_rating=data.overall_rating,
            review_data=data.review_data
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review
    
    def get_employee_performance_reviews(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> List[EmployeePerformanceReview]:
        """Get employee performance reviews"""
        return self.db.query(EmployeePerformanceReview).filter(
            and_(
                EmployeePerformanceReview.employee_id == employee_id,
                EmployeePerformanceReview.tenant_id == tenant_id
            )
        ).order_by(EmployeePerformanceReview.review_period_end.desc()).all()
    
    def add_employee_skill(
        self,
        employee_id: UUID,
        data: EmployeeSkillCreate,
        tenant_id: UUID
    ) -> EmployeeSkill:
        """Add employee skill"""
        skill = EmployeeSkill(
            tenant_id=tenant_id,
            employee_id=employee_id,
            skill_name=data.skill_name,
            skill_category=data.skill_category,
            proficiency_level=data.proficiency_level,
            years_of_experience=data.years_of_experience
        )
        self.db.add(skill)
        self.db.commit()
        self.db.refresh(skill)
        return skill
    
    def get_employee_skills(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> List[EmployeeSkill]:
        """Get employee skills"""
        return self.db.query(EmployeeSkill).filter(
            and_(
                EmployeeSkill.employee_id == employee_id,
                EmployeeSkill.tenant_id == tenant_id
            )
        ).all()
    
    def get_employee_global_profile(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> Optional[EmployeeGlobalProfile]:
        """Get employee global profile"""
        return self.db.query(EmployeeGlobalProfile).filter(
            and_(
                EmployeeGlobalProfile.employee_id == employee_id,
                EmployeeGlobalProfile.tenant_id == tenant_id
            )
        ).first()
    
    def create_global_profile(
        self,
        employee_id: UUID,
        data: GlobalProfileCreate,
        tenant_id: UUID
    ) -> EmployeeGlobalProfile:
        """Create or update global profile"""
        existing = self.get_employee_global_profile(employee_id, tenant_id)
        if existing:
            # Update existing
            existing.country_code = data.country_code
            existing.local_employee_id = data.local_employee_id
            existing.tax_id = data.tax_id
            existing.social_security_number = data.social_security_number
            existing.national_id = data.national_id
            existing.local_address = data.local_address
            existing.local_phone = data.local_phone
            existing.local_emergency_contact = data.local_emergency_contact
            existing.local_compliance_data = data.local_compliance_data
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            # Create new
            profile = EmployeeGlobalProfile(
                tenant_id=tenant_id,
                employee_id=employee_id,
                country_code=data.country_code,
                local_employee_id=data.local_employee_id,
                tax_id=data.tax_id,
                social_security_number=data.social_security_number,
                national_id=data.national_id,
                local_address=data.local_address,
                local_phone=data.local_phone,
                local_emergency_contact=data.local_emergency_contact,
                local_compliance_data=data.local_compliance_data
            )
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)
            return profile
    
    def get_employment_history(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> List[EmploymentHistory]:
        """Get employment history"""
        return self.db.query(EmploymentHistory).filter(
            and_(
                EmploymentHistory.employee_id == employee_id,
                EmploymentHistory.tenant_id == tenant_id
            )
        ).order_by(EmploymentHistory.start_date.desc()).all()
    
    def create_employment_history(
        self,
        employee_id: UUID,
        data: EmploymentHistoryCreate,
        tenant_id: UUID
    ) -> EmploymentHistory:
        """Create employment history record"""
        history = EmploymentHistory(
            tenant_id=tenant_id,
            employee_id=employee_id,
            job_title=data.job_title,
            department_id=data.department_id,
            manager_id=data.manager_id,
            start_date=data.start_date,
            end_date=data.end_date,
            reason_for_change=data.reason_for_change,
            promotion=data.promotion
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history
    
    def create_job_architecture(
        self,
        data: JobArchitectureCreate,
        tenant_id: UUID
    ) -> JobArchitecture:
        """Create job architecture entry"""
        job = JobArchitecture(
            tenant_id=tenant_id,
            job_code=data.job_code,
            job_title=data.job_title,
            job_family=data.job_family,
            job_level=data.job_level,
            job_category=data.job_category,
            description=data.description,
            requirements=data.requirements
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def get_job_architecture(
        self,
        tenant_id: UUID,
        job_family: Optional[str] = None,
        job_level: Optional[str] = None
    ) -> List[JobArchitecture]:
        """Get job architecture"""
        query = self.db.query(JobArchitecture).filter(
            JobArchitecture.tenant_id == tenant_id
        )
        if job_family:
            query = query.filter(JobArchitecture.job_family == job_family)
        if job_level:
            query = query.filter(JobArchitecture.job_level == job_level)
        return query.all()
    
    def get_compensation_bands_for_employee(
        self,
        employee_id: UUID,
        tenant_id: UUID
    ) -> List[CompensationBand]:
        """Get compensation bands available for employee"""
        employee = self.get_employee_by_id(employee_id, tenant_id)
        if not employee:
            return []
        
        query = self.db.query(CompensationBand).filter(
            CompensationBand.tenant_id == tenant_id
        )
        
        if employee.job_code:
            query = query.filter(CompensationBand.job_code == employee.job_code)
        if employee.country_code:
            query = query.filter(CompensationBand.country_code == employee.country_code)
        
        return query.filter(CompensationBand.status == "active").all()
