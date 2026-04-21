"""Shared enums across all services - Extended for Enterprise"""

from enum import Enum


class EventType(str, Enum):
    """Event types for event bus - Extended for Enterprise"""
    
    # Existing events
    USER_CREATED = "user.created"
    USER_UPDATED = "user.updated"
    EMPLOYEE_CREATED = "employee.created"
    EMPLOYEE_UPDATED = "employee.updated"
    DOCUMENT_UPLOADED = "document.uploaded"
    I9_CREATED = "i9.created"
    I9_UPDATED = "i9.updated"
    I9_AUDIT_TRIGGERED = "i9.audit.triggered"
    PAF_CREATED = "paf.created"
    IMMIGRATION_CASE_CREATED = "immigration.case.created"
    TIMESHEET_SUBMITTED = "timesheet.submitted"
    LEAVE_REQUESTED = "leave.requested"
    NOTIFICATION_SEND = "notification.send"
    INVOICE_CREATED = "invoice.created"
    PAYMENT_RECEIVED = "payment.received"
    MARKETING_CAMPAIGN_TRIGGER = "marketing.campaign.trigger"
    WORKFLOW_TRIGGER = "workflow.trigger"
    
    # Enterprise HRIS Events
    COMPENSATION_UPDATED = "compensation.updated"
    BENEFIT_ENROLLED = "benefit.enrolled"
    PERFORMANCE_REVIEW_CREATED = "performance.review.created"
    PERFORMANCE_REVIEW_COMPLETED = "performance.review.completed"
    EMPLOYMENT_HISTORY_UPDATED = "employment.history.updated"
    SKILL_ADDED = "skill.added"
    GLOBAL_PROFILE_UPDATED = "global.profile.updated"
    
    # Payroll Events
    PAYROLL_RUN_STARTED = "payroll.run.started"
    PAYROLL_RUN_COMPLETED = "payroll.run.completed"
    PAYROLL_PROCESSED = "payroll.processed"
    
    # Recruiting Events
    JOB_POSTING_CREATED = "job.posting.created"
    APPLICATION_SUBMITTED = "application.submitted"
    INTERVIEW_SCHEDULED = "interview.scheduled"
    OFFER_EXTENDED = "offer.extended"
    OFFER_ACCEPTED = "offer.accepted"
    
    # Performance Events
    OKR_CREATED = "okr.created"
    OKR_UPDATED = "okr.updated"
    ONE_ON_ONE_SCHEDULED = "one.on.one.scheduled"
    FEEDBACK_SUBMITTED = "feedback.submitted"
    
    # Learning Events
    COURSE_ASSIGNED = "course.assigned"
    COURSE_COMPLETED = "course.completed"
    CERTIFICATE_ISSUED = "certificate.issued"
    
    # Survey Events
    SURVEY_CREATED = "survey.created"
    SURVEY_RESPONSE_SUBMITTED = "survey.response.submitted"
    
    # Expense Events
    EXPENSE_SUBMITTED = "expense.submitted"
    EXPENSE_APPROVED = "expense.approved"
    EXPENSE_REIMBURSED = "expense.reimbursed"
    
    # Time & Attendance Events
    CLOCK_IN = "clock.in"
    CLOCK_OUT = "clock.out"
    SCHEDULE_CREATED = "schedule.created"
    
    # Project Management Events
    PROJECT_CREATED = "project.created"
    TASK_CREATED = "task.created"
    TASK_COMPLETED = "task.completed"
    SPRINT_CREATED = "sprint.created"
    
    # CRM Events
    LEAD_CREATED = "lead.created"
    OPPORTUNITY_CREATED = "opportunity.created"
    CONTACT_UPDATED = "contact.updated"
    
    # ITSM Events
    IT_TICKET_CREATED = "it.ticket.created"
    IT_TICKET_RESOLVED = "it.ticket.resolved"
    IDENTITY_REQUESTED = "identity.requested"
    
    # Global Contractor Events
    CONTRACTOR_CREATED = "contractor.created"
    EOR_WORKFLOW_STARTED = "eor.workflow.started"
    GLOBAL_PAYOUT_PROCESSED = "global.payout.processed"


class UserRole(str, Enum):
    """User roles - Extended for Enterprise"""
    
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    HRBP = "hrbp"
    MANAGER = "manager"
    EMPLOYEE = "employee"
    VIEWER = "viewer"
    RECRUITER = "recruiter"
    PAYROLL_ADMIN = "payroll_admin"
    FINANCE_ADMIN = "finance_admin"
    IT_ADMIN = "it_admin"
    PROJECT_MANAGER = "project_manager"
    CONTRACTOR = "contractor"
    CONTRACT_MANAGER = "contract_manager"  # Contract team: send/sign MSA, NDA, PO, WO, SOW, etc.


class DocumentType(str, Enum):
    """Document types - Extended for Enterprise"""
    
    I9 = "i9"
    PAF = "paf"
    H1B = "h1b"
    LCA = "lca"
    PASSPORT = "passport"
    DRIVER_LICENSE = "driver_license"
    HR_DOCUMENT = "hr_document"
    PERFORMANCE_REVIEW = "performance_review"
    OFFER_LETTER = "offer_letter"
    CONTRACT = "contract"
    CERTIFICATE = "certificate"
    EXPENSE_RECEIPT = "expense_receipt"
    OTHER = "other"


class I9Status(str, Enum):
    """I-9 form status"""
    
    DRAFT = "draft"
    SECTION1_COMPLETE = "section1_complete"
    SECTION2_COMPLETE = "section2_complete"
    COMPLETE = "complete"
    REVERIFICATION_REQUIRED = "reverification_required"
    EXPIRED = "expired"


class ImmigrationStatus(str, Enum):
    """Immigration case status"""
    
    DRAFT = "draft"
    LCA_PENDING = "lca_pending"
    PETITION_FILED = "petition_filed"
    APPROVED = "approved"
    DENIED = "denied"
    REVOKED = "revoked"


class PayrollStatus(str, Enum):
    """Payroll run status"""
    
    DRAFT = "draft"
    CALCULATING = "calculating"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ExpenseStatus(str, Enum):
    """Expense claim status"""
    
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    REIMBURSED = "reimbursed"


class ApplicationStatus(str, Enum):
    """Job application status"""
    
    DRAFT = "draft"
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class PerformanceReviewStatus(str, Enum):
    """Performance review status"""
    
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    PENDING_APPROVAL = "pending_approval"
    COMPLETED = "completed"
    ARCHIVED = "archived"
