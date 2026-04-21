"""Repository layer for OAuth 2.0 Service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID
import hashlib
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))

from ..models.db_models import OAuthClient, OAuthAuthorizationCode, OAuthRefreshToken


class OAuthRepository:
    """Repository for OAuth operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_client_by_id(self, client_id: str, tenant_id: UUID) -> OAuthClient | None:
        """Get client by ID"""
        return self.db.query(OAuthClient).filter(
            and_(
                OAuthClient.client_id == client_id,
                OAuthClient.tenant_id == tenant_id
            )
        ).first()
    
    def get_client_by_secret(self, client_id: str, client_secret: str) -> OAuthClient | None:
        """Get client by ID and verify secret"""
        client = self.db.query(OAuthClient).filter(
            OAuthClient.client_id == client_id
        ).first()
        
        if not client:
            return None
        
        # Verify secret
        client_secret_hash = hashlib.sha256(client_secret.encode()).hexdigest()
        if client_secret_hash != client.client_secret_hash:
            return None
        
        return client
    
    def get_authorization_code(self, code: str, client_id: str) -> OAuthAuthorizationCode | None:
        """Get authorization code"""
        return self.db.query(OAuthAuthorizationCode).filter(
            and_(
                OAuthAuthorizationCode.code == code,
                OAuthAuthorizationCode.client_id == client_id
            )
        ).first()
    
    def get_refresh_token(self, token: str, client_id: str) -> OAuthRefreshToken | None:
        """Get refresh token"""
        return self.db.query(OAuthRefreshToken).filter(
            and_(
                OAuthRefreshToken.token == token,
                OAuthRefreshToken.client_id == client_id
            )
        ).first()
