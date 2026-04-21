"""API routes for MFA Service"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_current_user, get_tenant_id
from shared_libs.database.postgres import get_db_session

from ..schemas.request import MFASetupRequest, MFAVerifyRequest, MFABackupCodeRequest
from ..schemas.response import MFASetupResponse, MFADeviceResponse, MFAVerifyResponse
from ..services.business import MFAService

router = APIRouter(prefix="/mfa", tags=["mfa"])


@router.post("/setup", response_model=APIResponse[MFASetupResponse])
async def setup_mfa(
    request_data: MFASetupRequest,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Setup MFA device"""
    current_user = get_current_user(request)
    tenant_id = get_tenant_id(request)
    user_id = UUID(current_user.get("sub"))
    
    service = MFAService(db)
    result = await service.setup_totp(user_id, tenant_id, request_data)
    return APIResponse.success_response(data=result, message="MFA setup successful")


@router.post("/verify", response_model=APIResponse[MFAVerifyResponse])
async def verify_mfa(
    request_data: MFAVerifyRequest,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Verify MFA code"""
    # Get user ID from header or token
    user_id_header = request.headers.get("X-User-ID")
    tenant_id_header = request.headers.get("X-Tenant-ID")
    
    if user_id_header and tenant_id_header:
        user_id = UUID(user_id_header)
        tenant_id = UUID(tenant_id_header)
    else:
        # Try to get from token
        try:
            current_user = get_current_user(request)
            tenant_id = get_tenant_id(request)
            user_id = UUID(current_user.get("sub"))
        except:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User identification required"
            )
    
    service = MFAService(db)
    result = await service.verify_totp(user_id, tenant_id, request_data)
    
    if not result.verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.message
        )
    
    return APIResponse.success_response(data=result, message="MFA verified")


@router.post("/verify-backup", response_model=APIResponse[MFAVerifyResponse])
async def verify_backup_code(
    request_data: MFABackupCodeRequest,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Verify backup code"""
    current_user = get_current_user(request)
    tenant_id = get_tenant_id(request)
    user_id = UUID(current_user.get("sub"))
    
    service = MFAService(db)
    result = await service.verify_backup_code(user_id, tenant_id, request_data)
    
    if not result.verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.message
        )
    
    return APIResponse.success_response(data=result, message="Backup code verified")


@router.get("/devices", response_model=APIResponse[list[MFADeviceResponse]])
async def get_mfa_devices(
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Get all MFA devices"""
    current_user = get_current_user(request)
    tenant_id = get_tenant_id(request)
    user_id = UUID(current_user.get("sub"))
    
    service = MFAService(db)
    devices = await service.get_devices(user_id, tenant_id)
    return APIResponse.success_response(data=devices, message="Devices retrieved")


@router.delete("/devices/{device_id}", response_model=APIResponse)
async def delete_mfa_device(
    device_id: UUID,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Delete MFA device"""
    current_user = get_current_user(request)
    tenant_id = get_tenant_id(request)
    user_id = UUID(current_user.get("sub"))
    
    service = MFAService(db)
    await service.delete_device(user_id, tenant_id, device_id)
    return APIResponse.success_response(message="Device deleted")
