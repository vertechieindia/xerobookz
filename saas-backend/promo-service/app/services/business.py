"""Business logic for Promo Code Service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from uuid import UUID
from datetime import date, datetime
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))

from ..models.db_models import PromoCode, PromoCodeUsage
from ..schemas.request import PromoCodeValidateRequest, PromoCodeCreateRequest
from ..schemas.response import PromoCodeResponse, PromoCodeValidationResponse
from ..repositories.repo import PromoCodeRepository


class PromoCodeService:
    """Promo code business logic"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = PromoCodeRepository(db)
    
    async def validate_promo_code(
        self,
        request: PromoCodeValidateRequest
    ) -> PromoCodeValidationResponse:
        """Validate a promo code"""
        today = date.today()
        
        # Find promo code
        promo = self.repo.get_by_code(request.code)
        
        if not promo:
            return PromoCodeValidationResponse(
                valid=False,
                message="Invalid promo code"
            )
        
        # Check if active
        if not promo.is_active:
            return PromoCodeValidationResponse(
                valid=False,
                message="Promo code is not active"
            )
        
        # Check date validity
        if today < promo.valid_from or today > promo.valid_until:
            return PromoCodeValidationResponse(
                valid=False,
                message="Promo code is not valid for current date"
            )
        
        # Check usage limit
        if promo.max_uses and promo.current_uses >= promo.max_uses:
            return PromoCodeValidationResponse(
                valid=False,
                message="Promo code has reached maximum usage limit"
            )
        
        # Check if already used by this tenant
        if request.tenant_id:
            if self.repo.is_used_by_tenant(request.tenant_id, promo.id):
                return PromoCodeValidationResponse(
                    valid=False,
                    message="Promo code has already been used"
                )
        
        # Valid promo code
        return PromoCodeValidationResponse(
            valid=True,
            code=promo.code,
            discount_type=promo.discount_type,
            discount_value=promo.discount_value,
            free_trial_days=promo.free_trial_days,
            message="Promo code is valid"
        )
    
    async def apply_promo_code(
        self,
        code: str,
        tenant_id: UUID,
        user_email: str
    ) -> PromoCodeResponse:
        """Apply a promo code (mark as used)"""
        promo = self.repo.get_by_code(code)
        
        if not promo:
            raise ValueError("Invalid promo code")
        
        # Record usage
        usage = PromoCodeUsage(
            promo_code_id=promo.id,
            tenant_id=tenant_id,
            user_email=user_email
        )
        self.db.add(usage)
        
        # Increment usage count
        promo.current_uses += 1
        self.db.commit()
        self.db.refresh(promo)
        
        return PromoCodeResponse.model_validate(promo)
    
    async def create_promo_code(
        self,
        request: PromoCodeCreateRequest
    ) -> PromoCodeResponse:
        """Create a new promo code"""
        promo = self.repo.create(
            code=request.code,
            description=request.description,
            discount_type=request.discount_type,
            discount_value=request.discount_value,
            free_trial_days=request.free_trial_days,
            valid_from=request.valid_from,
            valid_until=request.valid_until,
            max_uses=request.max_uses
        )
        
        return PromoCodeResponse.model_validate(promo)
