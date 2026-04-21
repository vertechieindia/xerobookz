"""Repository layer for Promo Code Service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID
from datetime import date
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))

from ..models.db_models import PromoCode, PromoCodeUsage


class PromoCodeRepository:
    """Repository for promo code operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_code(self, code: str) -> PromoCode | None:
        """Get promo code by code"""
        return self.db.query(PromoCode).filter(
            PromoCode.code == code.upper()
        ).first()
    
    def is_used_by_tenant(self, tenant_id: UUID, promo_code_id: UUID) -> bool:
        """Check if promo code is already used by tenant"""
        usage = self.db.query(PromoCodeUsage).filter(
            and_(
                PromoCodeUsage.tenant_id == tenant_id,
                PromoCodeUsage.promo_code_id == promo_code_id
            )
        ).first()
        return usage is not None
    
    def create(
        self,
        code: str,
        description: str = None,
        discount_type: str = "free_trial",
        discount_value: int = None,
        free_trial_days: int = None,
        valid_from: date = None,
        valid_until: date = None,
        max_uses: int = None
    ) -> PromoCode:
        """Create a new promo code"""
        promo = PromoCode(
            code=code.upper(),
            description=description,
            discount_type=discount_type,
            discount_value=discount_value,
            free_trial_days=free_trial_days,
            valid_from=valid_from,
            valid_until=valid_until,
            max_uses=max_uses,
            is_active=True
        )
        self.db.add(promo)
        self.db.commit()
        self.db.refresh(promo)
        return promo
