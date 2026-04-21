"""Contract Service - MSA, NDA, PO, WO, SOW - create, send, sign, AI quick-read"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.auth.middleware import get_tenant_id
from shared_libs.database.postgres import Base, get_engine
from sqlalchemy import text

from .config import settings
from .api.routes import router
from .models import db_models  # noqa: F401 - register models


@asynccontextmanager
async def lifespan(app: FastAPI):
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="XeroBookz Contract Service",
    version="1.0.0",
    description="Create, send, and sign MSA, NDA, PO, WO, SOW; AI quick-read and e-sign",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
        return await call_next(request)
    path = request.url.path
    if "contracts" not in path:
        return await call_next(request)
    try:
        request.state.tenant_id = get_tenant_id(request)
    except HTTPException:
        raise
    return await call_next(request)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.SERVICE_NAME}


app.include_router(router, prefix="/api/v1")
