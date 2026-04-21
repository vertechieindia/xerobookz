"""Authentication middleware utilities"""

from fastapi import Request, HTTPException, Header, Depends
from typing import Optional, Callable, List
from uuid import UUID
from shared_libs.auth.jwt import verify_token


TENANT_HEADER = "X-Tenant-ID"
AUTHORIZATION_HEADER = "Authorization"


def get_tenant_id(request: Request) -> UUID:
    """Extract tenant ID from request header"""
    tenant_id = request.headers.get(TENANT_HEADER)
    if not tenant_id:
        raise HTTPException(
            status_code=400,
            detail="Missing X-Tenant-ID header"
        )
    try:
        return UUID(tenant_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid tenant ID format"
        )


def get_current_user(request: Request) -> Optional[dict]:
    """Extract current user from JWT token"""
    auth_header = request.headers.get(AUTHORIZATION_HEADER)
    if not auth_header:
        return None
    
    if not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    return payload


def require_role(allowed_roles: List[str]):
    """Dependency that requires the current user to have one of the allowed roles."""
    def _require(request: Request) -> dict:
        user = get_current_user(request)
        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")
        role = (user.get("role") or user.get("roles") or "").lower()
        if isinstance(user.get("roles"), list):
            role = (user["roles"][0] if user["roles"] else "") or role
        if role not in [r.value if hasattr(r, "value") else r for r in allowed_roles]:
            allowed = [getattr(r, "value", r) for r in allowed_roles]
            raise HTTPException(status_code=403, detail=f"Requires one of: {allowed}")
        return user
    return _require

