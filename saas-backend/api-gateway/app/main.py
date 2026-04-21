"""API Gateway - Entry point to all services"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from contextlib import asynccontextmanager
import httpx
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../shared-libs"))
from shared_libs.auth.middleware import get_tenant_id, get_current_user
from shared_libs.auth.jwt import verify_token
from shared_libs.database.redis import get_redis_client
from .config import settings

# Service routing configuration
SERVICE_ROUTES = {
    "auth": "http://auth-service:8001",
    "users": "http://user-service:8002",
    "organization": "http://organization-service:8003",
    "employees": "http://employee-service:8004",
    "documents": "http://document-service:8005",
    "i9": "http://i9-service:8006",
    "everify": "http://e-verify-service:8007",
    "i9-audit": "http://i9-audit-service:8008",
    "paf": "http://paf-service:8009",
    "soc": "http://soc-predictor-service:8010",
    "immigration": "http://immigration-service:8011",
    "lca": "http://lca-service:8012",
    "timesheets": "http://timesheet-service:8013",
    "leave": "http://leave-service:8014",
    "notifications": "http://notification-service:8015",
    "audit": "http://audit-service:8016",
    "safety": "http://safety-service:8017",
    "onboarding": "http://onboarding-service:8018",
    "workflow": "http://workflow-service:8019",
    "invoice": "http://invoice-service:8020",
    "payments": "http://payment-service:8021",
    "finance": "http://finance-dashboard-service:8022",
    "marketing": "http://marketing-service:8023",
    "ess": "http://ess-service:8024",
    "ai": "http://ai-service:8025",
    "super-admin": "http://super-admin-service:8026",
    "promo": "http://promo-service:8027",
    "mfa": "http://mfa-service:8028",
    "oauth": "http://oauth-service:8029",
    "saml": "http://saml-service:8030",
    "contracts": "http://contract-service:8031",
    "attendance": "http://attendance-service:8032",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="XeroBookz API Gateway",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.middleware("http")
async def gateway_middleware(request: Request, call_next):
    """Gateway middleware for routing, auth, and rate limiting"""
    
    # Skip for health and docs
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
        return await call_next(request)
    
    # Extract service from path (support /api/v1/<service>/... and /<service>/...)
    path = request.url.path.strip("/")
    path_parts = path.split("/")
    if not path_parts:
        return await call_next(request)
    
    # Strip /api/v1 prefix if present
    if len(path_parts) >= 3 and path_parts[0] == "api" and path_parts[1] == "v1":
        path_parts = path_parts[2:]
    
    service_name = path_parts[0]
    
    # Public endpoints (no tenant or JWT required)
    public_auth_paths = ["login", "refresh", "signup"]
    public_promo_paths = ["validate"]
    is_public = (
        (service_name == "auth" and len(path_parts) > 1 and path_parts[1] in public_auth_paths)
        or (service_name == "promo" and len(path_parts) > 1 and path_parts[1] in public_promo_paths)
    )
    
    tenant_id = None
    if not is_public:
        try:
            tenant_id = get_tenant_id(request)
            request.state.tenant_id = tenant_id
        except HTTPException:
            raise
    
    # Verify JWT for non-public endpoints
    user = None
    if not is_public:
        user = get_current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")
        request.state.user = user
    
    # Rate limiting (skip Redis if unavailable for public endpoints)
    redis_client = get_redis_client()
    rate_limit_key = f"ratelimit:{tenant_id or 'anon'}:{user.get('sub') if user else 'anonymous'}:{service_name}"
    current = redis_client.incr(rate_limit_key)
    if current == 1:
        redis_client.expire(rate_limit_key, 60)  # 1 minute window
    if current > 100:  # 100 requests per minute
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded"}
        )
    
    # Route to service (forward path that services expect: /api/v1/<service>/...)
    if service_name in SERVICE_ROUTES:
        service_url = SERVICE_ROUTES[service_name]
        target_path = "/api/v1/" + "/".join(path_parts) if path_parts else "/"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.request(
                    method=request.method,
                    url=f"{service_url}{target_path}",
                    headers=dict(request.headers),
                    params=dict(request.query_params),
                    content=await request.body()
                )
                content_type = response.headers.get("content-type", "")
                if "application/json" in content_type:
                    return JSONResponse(
                        content=response.json(),
                        status_code=response.status_code
                    )
                return Response(
                    content=response.content,
                    status_code=response.status_code,
                    media_type=content_type or "application/octet-stream",
                    headers=dict(response.headers)
                )
            except httpx.RequestError as e:
                return JSONResponse(
                    status_code=503,
                    content={"error": "Service unavailable", "details": str(e)}
                )
    
    return await call_next(request)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.SERVICE_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
