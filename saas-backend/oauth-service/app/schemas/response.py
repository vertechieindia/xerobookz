"""Response schemas for OAuth 2.0 Service"""

from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class OAuthClientResponse(BaseModel):
    """OAuth client response"""
    id: UUID
    client_id: str
    client_name: str
    redirect_uris: List[str]
    scopes: List[str]
    grant_types: List[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class OAuthClientCreateResponse(BaseModel):
    """OAuth client creation response"""
    id: UUID
    client_id: str
    client_secret: str  # Only shown once
    client_name: str
    redirect_uris: List[str]
    scopes: List[str]
    grant_types: List[str]


class OAuthTokenResponse(BaseModel):
    """OAuth token response"""
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str] = None
    scope: Optional[str] = None
