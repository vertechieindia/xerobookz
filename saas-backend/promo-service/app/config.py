"""Configuration for Promo Code Service"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Service
    SERVICE_NAME: str = "promo-service"
    SERVICE_PORT: int = 8027
    
    # Database
    POSTGRES_URI: str = "postgresql://user:password@localhost:5432/xerobookz"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
