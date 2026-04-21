"""Business logic for auth-service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID, uuid4
from datetime import datetime, timedelta
import bcrypt
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.auth.jwt import encode_jwt, decode_jwt
from shared_libs.models.enums import EventType
from shared_libs.schemas.events import EventEnvelope

from ..models.db_models import User, Role, TenantUser, Tenant
from ..schemas.response import TokenResponse, UserResponse, RoleResponse
from ..repositories.repo import AuthRepository
from ..events.producers import EventProducer


class AuthService:
    """Authentication service"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = AuthRepository(db)
        self.event_producer = EventProducer()
    
    def _resolve_tenant_id(self, tenant_id_or_code: str) -> UUID | None:
        """Resolve tenant by UUID string or by code (e.g. XB000016272)."""
        s = (tenant_id_or_code or "").strip()
        if not s:
            return None
        try:
            return UUID(s)
        except (ValueError, TypeError):
            pass
        tenant = self.repo.get_tenant_by_code(s)
        return tenant.id if tenant else None

    async def login(
        self,
        email: str,
        password: str,
        tenant_id_or_code: str,
        mfa_code: str = None
    ) -> TokenResponse | None:
        """Authenticate user and return tokens. tenant_id_or_code can be UUID or tenant code."""
        tenant_id = self._resolve_tenant_id(tenant_id_or_code)
        if not tenant_id:
            return None

        user = self.repo.get_user_by_email(email)
        if not user:
            return None
        
        # Check password
        if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
            return None
        
        # Check tenant membership
        tenant_user = self.repo.get_tenant_user(user.id, tenant_id)
        if not tenant_user or not tenant_user.is_active:
            return None
        
        # Get user role (needed for MFA path and token)
        user_role = None
        if user.roles:
            user_role = user.roles[0].name if user.roles else None

        # Check MFA if enabled
        mfa_required = False
        if user.mfa_enabled:
            if not mfa_code:
                temp_token = encode_jwt({
                    "sub": str(user.id),
                    "email": user.email,
                    "tenant_id": str(tenant_id),
                    "role": user_role,
                    "type": "mfa_pending",
                    "mfa_required": True
                }, expires_in=timedelta(minutes=10))
                return TokenResponse(
                    access_token=temp_token,
                    refresh_token="",
                    expires_in=600,
                    user_role=user_role,
                    mfa_required=True
                )
            else:
                import httpx
                try:
                    async with httpx.AsyncClient() as client:
                        mfa_response = await client.post(
                            "http://mfa-service:8028/api/v1/mfa/verify",
                            json={"code": mfa_code},
                            headers={"X-User-ID": str(user.id), "X-Tenant-ID": str(tenant_id)}
                        )
                        if mfa_response.status_code != 200:
                            return None
                except Exception:
                    return None
        
        # Generate tokens
        access_token = encode_jwt({
            "sub": str(user.id),
            "email": user.email,
            "tenant_id": str(tenant_id),
            "role": user_role,
            "type": "access"
        })
        
        refresh_token = encode_jwt({
            "sub": str(user.id),
            "tenant_id": str(tenant_id),
            "type": "refresh"
        }, expires_in=timedelta(days=30))
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=24 * 3600,
            user_role=user_role,
            mfa_required=mfa_required
        )
    
    async def refresh_token(self, refresh_token: str) -> TokenResponse | None:
        """Refresh access token"""
        payload = decode_jwt(refresh_token)
        if not payload or payload.get("type") != "refresh":
            return None
        
        user_id = UUID(payload.get("sub"))
        tenant_id = UUID(payload.get("tenant_id"))
        
        user = self.repo.get_user_by_id(user_id)
        if not user:
            return None
        
        # Generate new access token
        access_token = encode_jwt({
            "sub": str(user.id),
            "email": user.email,
            "tenant_id": str(tenant_id),
            "type": "access"
        })
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=24 * 3600
        )
    
    async def logout(self, token: str):
        """Logout user (invalidate token)"""
        # TODO: Implement token blacklisting in Redis
        pass
    
    async def get_user_by_id(self, user_id: UUID) -> UserResponse | None:
        """Get user by ID (includes role/roles for frontend access control)"""
        from sqlalchemy.orm import joinedload
        user = self.db.query(User).options(joinedload(User.roles)).filter(User.id == user_id).first()
        if not user:
            return None
        role_names = [r.name for r in user.roles] if user.roles else []
        return UserResponse(
            id=user.id,
            email=user.email,
            is_active=user.is_active,
            is_verified=user.is_verified,
            mfa_enabled=user.mfa_enabled,
            created_at=user.created_at,
            updated_at=user.updated_at,
            role=role_names[0] if role_names else None,
            roles=role_names,
        )
    
    async def get_roles(self, tenant_id: UUID) -> list[RoleResponse]:
        """Get all roles for tenant"""
        roles = self.repo.get_roles_by_tenant(tenant_id)
        return [RoleResponse.model_validate(role) for role in roles]
    
    async def create_role(
        self,
        name: str,
        description: str = None,
        tenant_id: UUID = None
    ) -> RoleResponse:
        """Create a new role"""
        role = self.repo.create_role(name, description, tenant_id)
        return RoleResponse.model_validate(role)
    
    async def assign_role(
        self,
        user_id: UUID,
        role_id: UUID,
        tenant_id: UUID
    ):
        """Assign role to user"""
        self.repo.assign_role_to_user(user_id, role_id, tenant_id)
    
    async def create_user(
        self,
        email: str,
        password: str,
        tenant_id: UUID
    ) -> UserResponse:
        """Create a new user"""
        # Hash password
        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        
        # Create user
        user = User(
            email=email,
            password_hash=password_hash,
            is_active=True,
            is_verified=True
        )
        self.db.add(user)
        self.db.flush()
        
        # Get or create employee role
        employee_role = self.repo.get_role_by_name("employee", tenant_id)
        if not employee_role:
            employee_role = self.repo.create_role("employee", "Employee role", tenant_id)
        
        # Assign employee role
        user.roles.append(employee_role)
        
        # Create tenant-user association
        tenant_user = TenantUser(
            tenant_id=tenant_id,
            user_id=user.id,
            is_active=True
        )
        self.db.add(tenant_user)
        self.db.commit()
        self.db.refresh(user)
        
        return UserResponse.model_validate(user)
    
    async def signup(
        self,
        company_name: str,
        email: str,
        password: str,
        promo_code: str = None
    ) -> dict | None:
        """Signup - create company and admin user"""
        import httpx
        
        # Create tenant with a human-readable code for login (e.g. XB000016272)
        code = "XB" + uuid4().hex[:9].upper()
        tenant = self.repo.create_tenant(
            name=company_name,
            domain=None,
            is_active=True,
            code=code,
        )
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        
        # Create user
        user = User(
            email=email,
            password_hash=password_hash,
            is_active=True,
            is_verified=True
        )
        self.db.add(user)
        self.db.flush()
        
        # Get or create admin role
        admin_role = self.repo.get_role_by_name("admin", tenant.id)
        if not admin_role:
            admin_role = self.repo.create_role("admin", "Company Administrator", tenant.id)
        
        # Assign role
        user.roles.append(admin_role)
        
        # Create tenant-user association
        tenant_user = TenantUser(
            tenant_id=tenant.id,
            user_id=user.id,
            is_active=True
        )
        self.db.add(tenant_user)
        
        # Apply promo code if provided
        if promo_code:
            try:
                async with httpx.AsyncClient() as client:
                    # Validate promo code
                    validate_response = await client.post(
                        "http://promo-service:8027/api/v1/promo/validate",
                        json={"code": promo_code.upper()}
                    )
                    if validate_response.status_code == 200:
                        validate_result = validate_response.json()
                        if validate_result.get("success") and validate_result.get("data", {}).get("valid"):
                            # Apply promo code
                            await client.post(
                                "http://promo-service:8027/api/v1/promo/apply",
                                json={
                                    "code": promo_code.upper(),
                                    "tenant_id": str(tenant.id),
                                    "user_email": email
                                }
                            )
            except Exception:
                pass  # Continue even if promo code fails
        
        self.db.commit()
        
        # Publish event (optional - skip if RabbitMQ unavailable)
        try:
            event = EventEnvelope(
                event_type=EventType.USER_CREATED,
                tenant_id=tenant.id,
                payload={"user_id": str(user.id), "email": email}
            )
            await self.event_producer.publish(event)
        except Exception:
            pass
        
        return {
            "tenant_id": str(tenant.id),
            "tenant_code": tenant.code,
            "user_id": str(user.id),
            "email": email
        }

