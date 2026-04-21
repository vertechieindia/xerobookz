"""Request schemas for OAuth 2.0 Service"""

from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from uuid import UUID


class OAuthClientCreate(BaseModel):
    """Create OAuth client"""
    client_name: str
    redirect_uris: List[str]
    scopes: List[str]
    grant_types: List[str]  # authorization_code, client_credentials, refresh_token


class OAuthAuthorizeRequest(BaseModel):
    """OAuth authorization request"""
    client_id: str
    redirect_uri: str
    response_type: str  # code
    scope: Optional[str] = None
    state: Optional[str] = None
    code_challenge: Optional[str] = None
    code_challenge_method: Optional[str] = None  # S256, plain


class OAuthTokenRequest(BaseModel):
    """OAuth token request"""
    grant_type: str  # authorization_code, client_credentials, refresh_token
    code: Optional[str] = None
    redirect_uri: Optional[str] = None
    client_id: str
    client_secret: str
    code_verifier: Optional[str] = None  # For PKCE
    refresh_token: Optional[str] = None
    scope: Optional[str] = None
