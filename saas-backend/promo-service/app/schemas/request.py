"""Request schemas for Promo Code Service"""

from pydantic import BaseModel
from typing import Optional
from datetime import date
from uuid import UUID


class PromoCodeValidateRequest(BaseModel):
    """Request to validate a promo code"""
    code: str
    tenant_id: Optional[UUID] = None  # For checking if already used


class PromoCodeCreateRequest(BaseModel):
    """Request to create a promo code (Super Admin only)"""
    code: str
    description: Optional[str] = None
    discount_type: str  # percentage, fixed, free_trial
    discount_value: Optional[int] = None
    free_trial_days: Optional[int] = None
    valid_from: date
    valid_until: date
    max_uses: Optional[int] = None
