"""API routes for contract-service - MSA, NDA, PO, WO, SOW - create, send, sign, AI summary"""

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id
from shared_libs.database.postgres import get_db_session_dependency

from ..schemas.request import ContractCreateRequest, ContractSendRequest, ContractSignRequest
from ..schemas.response import ContractResponse, ContractAISummaryResponse
from ..services.business import ContractService

router = APIRouter(prefix="/contracts", tags=["contracts"])


def _get_current_user_id(request: Request) -> UUID:
    from shared_libs.auth.middleware import get_current_user
    user = get_current_user(request)
    if not user or not user.get("sub"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return UUID(user["sub"])


def _get_current_user_email(request: Request) -> str:
    from shared_libs.auth.middleware import get_current_user
    user = get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user.get("email") or ""


@router.post("", response_model=APIResponse[ContractResponse])
async def create_contract(
    request: Request,
    db: Session = Depends(get_db_session_dependency),
    contract_type: str = Form("other"),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    """Create a new contract (draft). Optionally upload a PDF/document."""
    tenant_id = get_tenant_id(request)
    user_id = _get_current_user_id(request)
    file_content = None
    file_name = None
    file_content_type = "application/pdf"
    if file:
        file_content = await file.read()
        file_name = file.filename or "document.pdf"
        file_content_type = getattr(file, "content_type", None) or "application/pdf"
    service = ContractService(db)
    result = await service.create_contract(
        tenant_id=tenant_id,
        created_by=user_id,
        contract_type=contract_type,
        title=title,
        description=description,
        file_content=file_content,
        file_name=file_name,
        file_content_type=file_content_type,
    )
    return APIResponse.success_response(data=result, message="Contract created")


@router.get("", response_model=APIResponse[list])
async def list_my_contracts(
    request: Request,
    status: Optional[str] = None,
    db: Session = Depends(get_db_session_dependency),
):
    """List contracts I created (sent by me)."""
    tenant_id = get_tenant_id(request)
    user_id = _get_current_user_id(request)
    service = ContractService(db)
    result = await service.list_my_contracts(tenant_id, user_id, status)
    return APIResponse.success_response(data=result, message="OK")


@router.get("/received", response_model=APIResponse[list])
async def list_received_contracts(
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    """List contracts I received (pending my signature)."""
    tenant_id = get_tenant_id(request)
    user_id = _get_current_user_id(request)
    user_email = _get_current_user_email(request)
    service = ContractService(db)
    result = await service.list_received(tenant_id, user_id, user_email)
    return APIResponse.success_response(data=result, message="OK")


@router.get("/{contract_id}", response_model=APIResponse[ContractResponse])
async def get_contract(
    contract_id: UUID,
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    """Get contract by ID."""
    tenant_id = get_tenant_id(request)
    service = ContractService(db)
    result = await service.get_contract(contract_id, tenant_id)
    if not result:
        raise HTTPException(status_code=404, detail="Contract not found")
    return APIResponse.success_response(data=result, message="OK")


@router.post("/{contract_id}/send", response_model=APIResponse[ContractResponse])
async def send_contract(
    contract_id: UUID,
    request: Request,
    body: ContractSendRequest,
    db: Session = Depends(get_db_session_dependency),
):
    """Send contract to recipients for signature."""
    tenant_id = get_tenant_id(request)
    user_id = _get_current_user_id(request)
    service = ContractService(db)
    result = await service.send_contract(
        contract_id=contract_id,
        tenant_id=tenant_id,
        user_id=user_id,
        recipients=body.recipients,
        message=body.message,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Contract not found or not draft")
    return APIResponse.success_response(data=result, message="Contract sent")


@router.post("/{contract_id}/sign", response_model=APIResponse[ContractResponse])
async def sign_contract(
    contract_id: UUID,
    request: Request,
    body: ContractSignRequest,
    db: Session = Depends(get_db_session_dependency),
):
    """Sign or decline a contract."""
    tenant_id = get_tenant_id(request)
    user_id = _get_current_user_id(request)
    user_email = _get_current_user_email(request)
    client = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    service = ContractService(db)
    result = await service.sign_contract(
        contract_id=contract_id,
        tenant_id=tenant_id,
        user_id=user_id,
        user_email=user_email,
        signature_data=body.signature_data,
        signature_type=body.signature_type,
        accept=body.accept,
        ip_address=client,
        user_agent=ua,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Contract not found or you are not a recipient")
    return APIResponse.success_response(
        data=result,
        message="Contract signed" if body.accept else "Contract declined",
    )


@router.get("/{contract_id}/ai-summary", response_model=APIResponse[ContractAISummaryResponse])
async def get_ai_summary(
    contract_id: UUID,
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    """Get AI-powered quick read: summary and sign/review/do-not-sign recommendation."""
    tenant_id = get_tenant_id(request)
    service = ContractService(db)
    result = await service.get_ai_summary(contract_id, tenant_id)
    if not result:
        raise HTTPException(status_code=404, detail="Contract not found")
    return APIResponse.success_response(data=result, message="OK")


@router.get("/{contract_id}/download")
async def download_contract(
    contract_id: UUID,
    request: Request,
    db: Session = Depends(get_db_session_dependency),
):
    """Download contract document."""
    from fastapi.responses import Response
    tenant_id = get_tenant_id(request)
    service = ContractService(db)
    doc = await service.get_document_content(contract_id, tenant_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Contract or document not found")
    return Response(
        content=doc["content"],
        media_type=doc["content_type"],
        headers={"Content-Disposition": f'attachment; filename="{doc["file_name"]}"'},
    )
