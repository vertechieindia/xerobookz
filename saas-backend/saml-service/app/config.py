"""Configuration for SAML 2.0 Service"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Service
    SERVICE_NAME: str = "saml-service"
    SERVICE_PORT: int = 8030
    
    # Database
    POSTGRES_URI: str = "postgresql://user:password@localhost:5432/xerobookz"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]
    
    # SAML Settings
    SAML_ENTITY_ID: str = "https://xerobookz.com/saml"
    SAML_ACS_URL: str = "https://xerobookz.com/saml/acs"
    SAML_SLO_URL: str = "https://xerobookz.com/saml/slo"
    SAML_CERT_VALIDITY_DAYS: int = 365
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
