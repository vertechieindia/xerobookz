"""Configuration for MFA Service"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Service
    SERVICE_NAME: str = "mfa-service"
    SERVICE_PORT: int = 8028
    
    # Database
    POSTGRES_URI: str = "postgresql://user:password@localhost:5432/xerobookz"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # MFA Settings
    MFA_ISSUER: str = "XeroBookz"
    TOTP_SECRET_LENGTH: int = 32
    BACKUP_CODE_COUNT: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
