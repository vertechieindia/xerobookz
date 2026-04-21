"""OAuth 2.0 Service - OAuth 2.0 authorization server"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../shared-libs"))
from shared_libs.schemas.response import APIResponse
from shared_libs.database.postgres import get_db_session

from .api.routes import router
from .config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager"""
    yield


app = FastAPI(
    title="XeroBookz OAuth 2.0 Service",
    version="1.0.0",
    description="OAuth 2.0 authorization server",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "oauth-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8029)
