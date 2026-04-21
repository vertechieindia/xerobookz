"""Database models for OAuth 2.0 Service"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class OAuthClient(Base):
    """OAuth 2.0 client application"""
    
    __tablename__ = "oauth_clients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    client_id = Column(String(255), unique=True, nullable=False, index=True)
    client_secret_hash = Column(String(255), nullable=False)  # Hashed secret
    client_name = Column(String(255), nullable=False)
    redirect_uris = Column(JSON, nullable=False)  # List of allowed redirect URIs
    scopes = Column(JSON, nullable=False)  # List of allowed scopes
    grant_types = Column(JSON, nullable=False)  # authorization_code, client_credentials, refresh_token
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class OAuthAuthorizationCode(Base):
    """OAuth 2.0 authorization code"""
    
    __tablename__ = "oauth_authorization_codes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    code = Column(String(255), unique=True, nullable=False, index=True)
    client_id = Column(String(255), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    redirect_uri = Column(String(500), nullable=False)
    scopes = Column(JSON, nullable=False)
    code_challenge = Column(String(255), nullable=True)  # PKCE
    code_challenge_method = Column(String(10), nullable=True)  # S256, plain
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())


class OAuthAccessToken(Base):
    """OAuth 2.0 access token"""
    
    __tablename__ = "oauth_access_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    token = Column(String(500), unique=True, nullable=False, index=True)
    client_id = Column(String(255), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # Null for client_credentials
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    scopes = Column(JSON, nullable=False)
    token_type = Column(String(20), default="Bearer")
    expires_at = Column(DateTime, nullable=False)
    refresh_token_id = Column(UUID(as_uuid=True), nullable=True)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())


class OAuthRefreshToken(Base):
    """OAuth 2.0 refresh token"""
    
    __tablename__ = "oauth_refresh_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    token = Column(String(500), unique=True, nullable=False, index=True)
    access_token_id = Column(UUID(as_uuid=True), ForeignKey("oauth_access_tokens.id"), nullable=False)
    client_id = Column(String(255), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    scopes = Column(JSON, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
