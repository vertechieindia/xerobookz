"""Main FastAPI application for employee-service"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../shared-libs"))
from shared_libs.auth.middleware import get_tenant_id
from .config import settings
from .api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="XeroBookz Employee Lifecycle Management Service",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.middleware("http")
async def tenant_middleware(request: Request, call_next):
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
