"""API routes for Promo Code Service"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import require_role
from shared_libs.models.enums import UserRole
from shared_libs.database.postgres import get_db_session_dependency

from ..schemas.request import PromoCodeValidateRequest, PromoCodeCreateRequest
from ..schemas.response import PromoCodeResponse, PromoCodeValidationResponse
from ..services.business import PromoCodeService

router = APIRouter(prefix="/promo", tags=["promo"])


@router.post("/validate", response_model=APIResponse[PromoCodeValidationResponse])
async def validate_promo_code(
    request: PromoCodeValidateRequest,
    db: Session = Depends(get_db_session_dependency)
):
    """Validate a promo code"""
    service = PromoCodeService(db)
    result = await service.validate_promo_code(request)
    return APIResponse.success_response(data=result, message="Validation completed")


@router.post("/apply", response_model=APIResponse[PromoCodeResponse])
async def apply_promo_code(
    code: str,
    tenant_id: str,
    user_email: str,
    db: Session = Depends(get_db_session_dependency)
):
    """Apply a promo code"""
    from uuid import UUID
    service = PromoCodeService(db)
    result = await service.apply_promo_code(code, UUID(tenant_id), user_email)
    return APIResponse.success_response(data=result, message="Promo code applied successfully")


@router.post("/create", response_model=APIResponse[PromoCodeResponse])
async def create_promo_code(
    request: PromoCodeCreateRequest,
    db: Session = Depends(get_db_session_dependency),
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Create a new promo code (Super Admin only)"""
    service = PromoCodeService(db)
    result = await service.create_promo_code(request)
    return APIResponse.success_response(data=result, message="Promo code created successfully")
