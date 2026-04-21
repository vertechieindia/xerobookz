"""Configuration for contract-service"""

import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    SERVICE_NAME: str = "contract-service"
    SERVICE_PORT: int = 8031
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    POSTGRES_URI: str = os.getenv("POSTGRES_URI", "postgresql://user:password@localhost:5432/xerobookz")
    AI_SERVICE_URL: str = os.getenv("AI_SERVICE_URL", "http://ai-service:8025")
    TENANT_HEADER: str = os.getenv("TENANT_HEADER", "X-Tenant-ID")
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
