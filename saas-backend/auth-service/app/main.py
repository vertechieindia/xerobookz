"""Main FastAPI application for auth-service"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id

from .config import settings
from .api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    # Create DB tables if they don't exist (dev convenience)
    from shared_libs.database.postgres import get_engine, Base
    from app.models import db_models  # noqa: F401 - register models with Base.metadata
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    # Migrate roles: allow same role name per tenant (drop old unique on name, add (name, tenant_id))
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_name_key"))
            conn.execute(text("ALTER TABLE roles DROP CONSTRAINT IF EXISTS uq_role_name_tenant"))
            conn.execute(text("ALTER TABLE roles ADD CONSTRAINT uq_role_name_tenant UNIQUE (name, tenant_id)"))
            conn.commit()
    except Exception:
        pass
    # Add tenants.code if missing (tenant code for login, e.g. XB000016272)
    try:
        with engine.connect() as conn:
            conn.execute(text(
                "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS code VARCHAR(50) UNIQUE"
            ))
            conn.commit()
    except Exception:
        pass
    yield
    # Shutdown


app = FastAPI(
    title="XeroBookz Auth Service",
    description="Authentication and Authorization Service",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    """Multi-tenancy middleware"""
    # Skip tenant check for health check
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
        return await call_next(request)
    
    try:
        tenant_id = get_tenant_id(request)
        request.state.tenant_id = tenant_id
    except HTTPException:
        # Allow public endpoints without tenant (path may be /auth/... or /api/v1/auth/...)
        path = request.url.path
        if any(path.endswith(p) or p in path for p in ["/auth/login", "/auth/refresh", "/auth/signup"]):
            pass
        else:
            raise
    
    response = await call_next(request)
    return response


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.SERVICE_NAME}


app.include_router(router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

