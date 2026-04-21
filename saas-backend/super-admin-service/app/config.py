"""Configuration for Super Admin Service"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Service
    SERVICE_NAME: str = "super-admin-service"
    SERVICE_PORT: int = 8026
    
    # Database
    POSTGRES_URI: str = "postgresql://user:password@localhost:5432/xerobookz"
    
    # Redis
    REDIS_URI: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # API Keys
    API_KEY_LENGTH: int = 32
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
