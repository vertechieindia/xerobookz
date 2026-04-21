"""Business logic for OAuth 2.0 Service"""

from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
import secrets
import hashlib
import base64
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.auth.jwt import encode_jwt

from ..models.db_models import OAuthClient, OAuthAuthorizationCode, OAuthAccessToken, OAuthRefreshToken
from ..schemas.request import OAuthClientCreate, OAuthAuthorizeRequest, OAuthTokenRequest
from ..schemas.response import OAuthClientResponse, OAuthClientCreateResponse, OAuthTokenResponse
from ..repositories.repo import OAuthRepository
from ..config import settings


class OAuthService:
    """OAuth 2.0 business logic"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = OAuthRepository(db)
    
    async def create_client(
        self,
        tenant_id: UUID,
        request: OAuthClientCreate
    ) -> OAuthClientCreateResponse:
        """Create OAuth client"""
        # Generate client ID and secret
        client_id = secrets.token_urlsafe(settings.OAUTH_CLIENT_ID_LENGTH)
        client_secret = secrets.token_urlsafe(settings.OAUTH_CLIENT_SECRET_LENGTH)
        client_secret_hash = hashlib.sha256(client_secret.encode()).hexdigest()
        
        # Create client
        client = OAuthClient(
            tenant_id=tenant_id,
            client_id=client_id,
            client_secret_hash=client_secret_hash,
            client_name=request.client_name,
            redirect_uris=request.redirect_uris,
            scopes=request.scopes,
            grant_types=request.grant_types,
            is_active=True
        )
        
        self.db.add(client)
        self.db.commit()
        self.db.refresh(client)
        
        return OAuthClientCreateResponse(
            id=client.id,
            client_id=client_id,
            client_secret=client_secret,  # Only shown once
            client_name=client.client_name,
            redirect_uris=client.redirect_uris,
            scopes=client.scopes,
            grant_types=client.grant_types
        )
    
    async def authorize(
        self,
        user_id: UUID,
        tenant_id: UUID,
        request: OAuthAuthorizeRequest
    ) -> str:
        """Generate authorization code"""
        # Verify client
        client = self.repo.get_client_by_id(request.client_id, tenant_id)
        if not client or not client.is_active:
            raise ValueError("Invalid client")
        
        # Verify redirect URI
        if request.redirect_uri not in client.redirect_uris:
            raise ValueError("Invalid redirect URI")
        
        # Generate authorization code
        code = secrets.token_urlsafe(32)
        
        # Parse scopes
        scopes = request.scope.split() if request.scope else []
        # Validate scopes
        for scope in scopes:
            if scope not in client.scopes:
                raise ValueError(f"Invalid scope: {scope}")
        
        # Create authorization code
        auth_code = OAuthAuthorizationCode(
            code=code,
            client_id=client.client_id,
            user_id=user_id,
            tenant_id=tenant_id,
            redirect_uri=request.redirect_uri,
            scopes=scopes,
            code_challenge=request.code_challenge,
            code_challenge_method=request.code_challenge_method,
            expires_at=datetime.utcnow() + timedelta(seconds=settings.AUTHORIZATION_CODE_EXPIRY),
            is_used=False
        )
        
        self.db.add(auth_code)
        self.db.commit()
        
        return code
    
    async def exchange_code_for_token(
        self,
        request: OAuthTokenRequest
    ) -> OAuthTokenResponse:
        """Exchange authorization code for access token"""
        # Verify client
        client = self.repo.get_client_by_secret(request.client_id, request.client_secret)
        if not client or not client.is_active:
            raise ValueError("Invalid client credentials")
        
        if request.grant_type == "authorization_code":
            # Get authorization code
            auth_code = self.repo.get_authorization_code(request.code, request.client_id)
            if not auth_code:
                raise ValueError("Invalid authorization code")
            
            if auth_code.is_used:
                raise ValueError("Authorization code already used")
            
            if auth_code.expires_at < datetime.utcnow():
                raise ValueError("Authorization code expired")
            
            # Verify redirect URI
            if request.redirect_uri != auth_code.redirect_uri:
                raise ValueError("Invalid redirect URI")
            
            # Verify PKCE if present
            if auth_code.code_challenge:
                if not request.code_verifier:
                    raise ValueError("Code verifier required")
                
                if auth_code.code_challenge_method == "S256":
                    import hashlib
                    code_verifier_hash = base64.urlsafe_b64encode(
                        hashlib.sha256(request.code_verifier.encode()).digest()
                    ).decode().rstrip("=")
                    if code_verifier_hash != auth_code.code_challenge:
                        raise ValueError("Invalid code verifier")
                elif auth_code.code_challenge_method == "plain":
                    if request.code_verifier != auth_code.code_challenge:
                        raise ValueError("Invalid code verifier")
            
            # Mark code as used
            auth_code.is_used = True
            
            # Generate tokens
            return await self._generate_tokens(
                client_id=client.client_id,
                user_id=auth_code.user_id,
                tenant_id=auth_code.tenant_id,
                scopes=auth_code.scopes
            )
        
        elif request.grant_type == "refresh_token":
            # Get refresh token
            refresh_token = self.repo.get_refresh_token(request.refresh_token, request.client_id)
            if not refresh_token:
                raise ValueError("Invalid refresh token")
            
            if refresh_token.is_revoked:
                raise ValueError("Refresh token revoked")
            
            if refresh_token.expires_at < datetime.utcnow():
                raise ValueError("Refresh token expired")
            
            # Generate new tokens
            return await self._generate_tokens(
                client_id=client.client_id,
                user_id=refresh_token.user_id,
                tenant_id=refresh_token.tenant_id,
                scopes=refresh_token.scopes,
                old_refresh_token_id=refresh_token.id
            )
        
        elif request.grant_type == "client_credentials":
            # Client credentials flow (no user)
            scopes = request.scope.split() if request.scope else []
            # Validate scopes
            for scope in scopes:
                if scope not in client.scopes:
                    raise ValueError(f"Invalid scope: {scope}")
            
            return await self._generate_tokens(
                client_id=client.client_id,
                user_id=None,
                tenant_id=client.tenant_id,
                scopes=scopes
            )
        
        else:
            raise ValueError(f"Unsupported grant type: {request.grant_type}")
    
    async def _generate_tokens(
        self,
        client_id: str,
        user_id: UUID | None,
        tenant_id: UUID,
        scopes: list,
        old_refresh_token_id: UUID | None = None
    ) -> OAuthTokenResponse:
        """Generate access and refresh tokens"""
        # Generate access token
        access_token_value = secrets.token_urlsafe(64)
        
        # Generate refresh token
        refresh_token_value = secrets.token_urlsafe(64)
        
        # Create access token
        access_token = OAuthAccessToken(
            token=access_token_value,
            client_id=client_id,
            user_id=user_id,
            tenant_id=tenant_id,
            scopes=scopes,
            token_type="Bearer",
            expires_at=datetime.utcnow() + timedelta(seconds=settings.ACCESS_TOKEN_EXPIRY),
            is_revoked=False
        )
        self.db.add(access_token)
        self.db.flush()
        
        # Revoke old refresh token if present
        if old_refresh_token_id:
            old_refresh = self.db.query(OAuthRefreshToken).filter(
                OAuthRefreshToken.id == old_refresh_token_id
            ).first()
            if old_refresh:
                old_refresh.is_revoked = True
        
        # Create refresh token
        refresh_token = OAuthRefreshToken(
            token=refresh_token_value,
            access_token_id=access_token.id,
            client_id=client_id,
            user_id=user_id,
            tenant_id=tenant_id,
            scopes=scopes,
            expires_at=datetime.utcnow() + timedelta(seconds=settings.REFRESH_TOKEN_EXPIRY),
            is_revoked=False
        )
        self.db.add(refresh_token)
        
        access_token.refresh_token_id = refresh_token.id
        self.db.commit()
        
        return OAuthTokenResponse(
            access_token=access_token_value,
            token_type="Bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRY,
            refresh_token=refresh_token_value,
            scope=" ".join(scopes) if scopes else None
        )
