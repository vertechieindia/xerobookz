"""Response schemas for Promo Code Service"""

from pydantic import BaseModel
from typing import Optional
from datetime import date
from uuid import UUID


class PromoCodeResponse(BaseModel):
    """Promo code response"""
    id: UUID
    code: str
    description: Optional[str]
    discount_type: str
    discount_value: Optional[int]
    free_trial_days: Optional[int]
    valid_from: date
    valid_until: date
    max_uses: Optional[int]
    current_uses: int
    is_active: bool
    
    class Config:
        from_attributes = True


class PromoCodeValidationResponse(BaseModel):
    """Promo code validation response"""
    valid: bool
    code: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[int] = None
    free_trial_days: Optional[int] = None
    message: Optional[str] = None
