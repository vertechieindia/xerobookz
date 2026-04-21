#!/usr/bin/env python3
"""
Seed VerTechie LLC company admin for local/dev login.
Creates tenant "VerTechie LLC" with code XB000016272 and admin user
contracts@vertechie.com / Xerobookz@2026 with full company admin access.

Run from repo root (with API stack running and DB available):
  POSTGRES_URI=postgresql://xerobookz:xerobookz_dev@localhost:5432/xerobookz \
  python saas-backend/auth-service/scripts/seed_vertechie_admin.py

Or from auth-service directory:
  POSTGRES_URI=postgresql://xerobookz:xerobookz_dev@localhost:5432/xerobookz \
  python scripts/seed_vertechie_admin.py
"""

import sys
import os
from pathlib import Path

# Paths so we can import app and shared_libs (works from host or inside Docker)
SCRIPT_DIR = Path(__file__).resolve().parent
if Path("/app/app").exists():
    AUTH_SERVICE_ROOT = Path("/app")
    SHARED_LIBS = AUTH_SERVICE_ROOT / "shared-libs"
else:
    AUTH_SERVICE_ROOT = SCRIPT_DIR.parent
    SAAS_BACKEND = AUTH_SERVICE_ROOT.parent
    SHARED_LIBS = SAAS_BACKEND / "shared-libs"
sys.path.insert(0, str(SHARED_LIBS))
sys.path.insert(0, str(AUTH_SERVICE_ROOT))

import bcrypt
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Use env so Docker host can pass POSTGRES_URI
POSTGRES_URI = os.getenv("POSTGRES_URI", "postgresql://xerobookz:xerobookz_dev@localhost:5432/xerobookz")

# Import after path setup
from app.models.db_models import Base, Tenant, User, Role, TenantUser
from app.repositories.repo import AuthRepository


def ensure_tenants_code_column(session):
    """Ensure tenants table has code column (for existing DBs)."""
    try:
        session.execute(text(
            "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS code VARCHAR(50)"
        ))
        session.commit()
    except Exception:
        session.rollback()


def run():
    engine = create_engine(POSTGRES_URI)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    repo = AuthRepository(db)

    try:
        ensure_tenants_code_column(db)

        tenant_code = "XB000016272"
        company_name = "VerTechie LLC"
        email = "contracts@vertechie.com"
        password = "Xerobookz@2026"

        # 1) Get or create tenant
        tenant = repo.get_tenant_by_code(tenant_code)
        if not tenant:
            tenant = repo.create_tenant(
                name=company_name,
                domain=None,
                is_active=True,
                code=tenant_code,
            )
            print(f"Created tenant: {company_name} (code: {tenant_code})")
        else:
            if tenant.name != company_name:
                tenant.name = company_name
                db.commit()
                db.refresh(tenant)
            print(f"Tenant already exists: {tenant.name} (code: {tenant_code})")

        # 2) Get or create user
        user = repo.get_user_by_email(email)
        if not user:
            password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
            user = User(
                email=email,
                password_hash=password_hash,
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.flush()
            print(f"Created user: {email}")
        else:
            # Update password so the given one works
            password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
            user.password_hash = password_hash
            user.is_active = True
            db.commit()
            db.refresh(user)
            print(f"User already exists, password updated: {email}")

        # 3) Ensure tenant-user link
        tenant_user = repo.get_tenant_user(user.id, tenant.id)
        if not tenant_user:
            tenant_user = TenantUser(
                tenant_id=tenant.id,
                user_id=user.id,
                is_active=True,
            )
            db.add(tenant_user)
            db.flush()
            print("Linked user to tenant.")
        else:
            tenant_user.is_active = True
            db.commit()

        # 4) Ensure admin role and assign to user
        admin_role = repo.get_role_by_name("admin", tenant.id)
        if not admin_role:
            admin_role = repo.create_role("admin", "Company Administrator", tenant.id)
            print("Created admin role.")
        if admin_role not in user.roles:
            user.roles.append(admin_role)
            db.commit()
            print("Assigned admin role to user.")
        else:
            print("User already has admin role.")

        db.commit()
        print("")
        print("You can log in with:")
        print("  Email:     ", email)
        print("  Password:  ", password)
        print("  Tenant ID or Code:", tenant_code)
        print("  (Use Company Admin portal; you will have full company admin access.)")
        print("")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
