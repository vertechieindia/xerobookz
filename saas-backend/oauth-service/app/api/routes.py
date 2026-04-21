"""API routes for OAuth 2.0 Service"""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from sqlalchemy.orm import Session
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_current_user, get_tenant_id
from shared_libs.database.postgres import get_db_session

from ..schemas.request import OAuthClientCreate, OAuthAuthorizeRequest, OAuthTokenRequest
from ..schemas.response import OAuthClientResponse, OAuthClientCreateResponse, OAuthTokenResponse
from ..services.business import OAuthService

router = APIRouter(prefix="/oauth", tags=["oauth"])


@router.post("/clients", response_model=APIResponse[OAuthClientCreateResponse])
async def create_client(
    request_data: OAuthClientCreate,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """Create OAuth client"""
    current_user = get_current_user(request)
    tenant_id = get_tenant_id(request)
    
    service = OAuthService(db)
    result = await service.create_client(tenant_id, request_data)
    return APIResponse.success_response(data=result, message="OAuth client created")


@router.post("/authorize", response_model=APIResponse)
async def authorize(
    request_data: OAuthAuthorizeRequest,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """OAuth authorization endpoint"""
    current_user = get_current_user(request)
    tenant_id = get_tenant_id(request)
    user_id = UUID(current_user.get("sub"))
    
    service = OAuthService(db)
    code = await service.authorize(user_id, tenant_id, request_data)
    
    # Redirect with authorization code
    redirect_uri = f"{request_data.redirect_uri}?code={code}"
    if request_data.state:
        redirect_uri += f"&state={request_data.state}"
    
    return APIResponse.success_response(
        data={"redirect_uri": redirect_uri, "code": code},
        message="Authorization successful"
    )


@router.post("/token", response_model=OAuthTokenResponse)
async def token(
    grant_type: str = Form(...),
    code: str = Form(None),
    redirect_uri: str = Form(None),
    client_id: str = Form(...),
    client_secret: str = Form(...),
    code_verifier: str = Form(None),
    refresh_token: str = Form(None),
    scope: str = Form(None),
    db: Session = Depends(get_db_session)
):
    """OAuth token endpoint (RFC 6749 compliant)"""
    request_data = OAuthTokenRequest(
        grant_type=grant_type,
        code=code,
        redirect_uri=redirect_uri,
        client_id=client_id,
        client_secret=client_secret,
        code_verifier=code_verifier,
        refresh_token=refresh_token,
        scope=scope
    )
    
    service = OAuthService(db)
    try:
        result = await service.exchange_code_for_token(request_data)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
