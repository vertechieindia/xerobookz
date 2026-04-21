"""Configuration for OAuth 2.0 Service"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Service
    SERVICE_NAME: str = "oauth-service"
    SERVICE_PORT: int = 8029
    
    # Database
    POSTGRES_URI: str = "postgresql://user:password@localhost:5432/xerobookz"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # OAuth Settings
    OAUTH_CLIENT_ID_LENGTH: int = 32
    OAUTH_CLIENT_SECRET_LENGTH: int = 64
    ACCESS_TOKEN_EXPIRY: int = 3600  # 1 hour
    REFRESH_TOKEN_EXPIRY: int = 86400 * 30  # 30 days
    AUTHORIZATION_CODE_EXPIRY: int = 600  # 10 minutes
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
