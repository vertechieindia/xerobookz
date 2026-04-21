"""Database models for Promo Code Service"""

from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class PromoCode(Base):
    """Promo code model"""
    
    __tablename__ = "promo_codes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    discount_type = Column(String(20), nullable=False)  # percentage, fixed, free_trial
    discount_value = Column(Integer, nullable=True)  # percentage or fixed amount
    free_trial_days = Column(Integer, nullable=True)  # days of free trial
    valid_from = Column(Date, nullable=False)
    valid_until = Column(Date, nullable=False)
    max_uses = Column(Integer, nullable=True)  # None = unlimited
    current_uses = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class PromoCodeUsage(Base):
    """Promo code usage tracking"""
    
    __tablename__ = "promo_code_usage"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    promo_code_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_email = Column(String(255), nullable=False)
    used_at = Column(DateTime, default=func.now(), nullable=False)
