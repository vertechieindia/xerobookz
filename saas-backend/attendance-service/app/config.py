import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SERVICE_NAME: str = "attendance-service"
    SERVICE_PORT: int = int(os.getenv("SERVICE_PORT", "8032"))
    POSTGRES_URI: str = os.getenv("POSTGRES_URI", "postgresql://user:password@localhost:5432/xerobookz")
    TENANT_HEADER: str = os.getenv("TENANT_HEADER", "X-Tenant-ID")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-in-production")
    CORS_ORIGINS: list = ["*"]
    EMPLOYEE_SERVICE_URL: str = os.getenv("EMPLOYEE_SERVICE_URL", "http://employee-service:8004")
    TIMESHEET_SERVICE_URL: str = os.getenv("TIMESHEET_SERVICE_URL", "http://timesheet-service:8013")

    class Config:
        env_file = ".env"


settings = Settings()
