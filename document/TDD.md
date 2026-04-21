# Technical Design Document (TDD)
## XeroBookz – Everything You Need to Run Your Entire Business

**Version:** 2.1  
**Last Updated:** 2026

---

## Platform totals (reference)

| Metric | Count |
|--------|--------|
| **Modules** | 10 |
| **Product services** | 53 |
| **Backend microservices** | 31+ |
| **Data stores** | 3 (PostgreSQL, MongoDB, Redis) |

---

## 1. Overview

This document describes the technical architecture, components, data flows, and design decisions for XeroBookz. It is intended for engineers and technical stakeholders.

**Platform scope (see BRD and APPLICATION-BUSINESS-FEATURES):** The platform is designed to support the full product scope: **Platform Core** (auth, tenant, RBAC, billing), **Website** (builder, blog, forum, eLearning, live chat), **Sales** (CRM, sales orders, POS, subscriptions, rental), **Finance** (accounting, bookkeeping, immigration, invoicing, expenses, documents, spreadsheets, e-signatures), **Inventory & Manufacturing** (inventory, manufacturing, PLM, procurement, maintenance, quality), **Human Resources** (employees, recruitment, time off, appraisals, referrals, fleet), **Marketing** (automation, email, SMS, social, events, surveys), **Services** (projects, timesheets, field service, helpdesk, planning, appointments), **Productivity** (chat, approvals, IoT, VoIP, knowledge base), and **Customization** (Studio no-code builder). Implemented services today cover Platform Core, HR/immigration/compliance, invoicing/payments, Contract Team (e-signatures), and foundational workflows; additional modules are added as microservices following the same patterns (tenant isolation, API gateway routing, shared-libs).

---

## 2. Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js (admin-web), React, TypeScript, shared UI and API client packages; public routes include `/`, `/about`, `/contact`, `/privacy`, `/terms`, `/login`, `/signup` |
| **Mobile** | React Native (employee-facing app) |
| **API** | FastAPI (Python 3.11), API Gateway as single entry point |
| **Backend services** | 30+ microservices (FastAPI), see ARCHITECTURE.md; includes auth, HR, compliance, finance, contract-service, and extensible for Website, Sales, Inventory, Marketing, Services, Productivity, Customization |
| **Databases** | PostgreSQL (primary, relational), MongoDB (documents, GridFS), Redis (cache, sessions, rate limit) |
| **Messaging** | RabbitMQ (event-driven, async workflows) |
| **Auth** | JWT (access/refresh), OAuth 2.0, optional SAML 2.0, TOTP (MFA) |
| **Infrastructure** | Docker, Docker Compose, Kubernetes/Helm (optional), Vercel (frontend hosting option) |

---

## 3. System Context

```
                    ┌─────────────────────────────────────────┐
                    │  Clients (Browser, Mobile, 3rd-party)   │
                    └─────────────────────┬──────────────────┘
                                          │
                    ┌─────────────────────▼──────────────────┐
                    │  API Gateway ( :8000 )                  │
                    │  - Routing, auth, rate limit, CORS      │
                    └─────────────────────┬──────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
        ▼                                 ▼                                 ▼
┌───────────────┐               ┌───────────────┐               ┌───────────────┐
│ Auth / Identity│               │ Business      │               │ Compliance &  │
│ auth, user,   │               │ employee,    │               │ i9, everify,  │
│ mfa, oauth,   │               │ onboarding,   │               │ immigration,  │
│ saml, promo   │               │ document,     │               │ lca, paf,     │
│               │               │ timesheet,    │               │ i9-audit,     │
│               │               │ leave, etc.  │               │ soc-predictor │
└───────┬───────┘               └───────┬───────┘               └───────┬───────┘
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────┐             ┌───────────────┐             ┌───────────────┐
│  PostgreSQL   │             │   MongoDB     │             │    Redis      │
│  (primary)    │             │  (documents)  │             │ (cache/session)│
└───────────────┘             └───────────────┘             └───────────────┘
        │                                                             │
        └─────────────────────────────┬───────────────────────────────┘
                                      ▼
                              ┌───────────────┐
                              │   RabbitMQ    │
                              │   (events)    │
                              └───────────────┘
```

---

## 4. API Gateway Design

- **Single entry:** All client requests hit the gateway (e.g. `http://localhost:8000`).
- **Routing:** Path-based routing to backend services (e.g. `/api/v1/auth/*` → auth-service, `/api/v1/employees/*` → employee-service). See gateway `SERVICE_ROUTES` for full mapping.
- **Auth:** Public routes (e.g. login, signup, refresh, promo validate) bypass JWT. All other routes require valid JWT; tenant ID from header or token.
- **Rate limiting:** Per tenant/user/service key in Redis (e.g. 100 req/min).
- **CORS:** Configured for frontend origins.
- **Response:** Gateway proxies request/response; on downstream failure returns 503 with error detail.

---

## 5. Authentication & Authorization Design

### 5.1 Tokens

- **Access token:** JWT, short-lived (e.g. 24h), contains `sub` (user id), `tenant_id`, `role`, scopes.
- **Refresh token:** Stored (e.g. DB or Redis); used to issue new access token; revocable on logout.
- **Issuance:** Auth-service issues tokens on login; validated by gateway and shared_libs (JWT verify).

### 5.2 MFA (TOTP)

- **MFA-service:** Generates TOTP secret, QR code; verifies TOTP code; backup codes supported.
- **Flow:** User enables MFA in settings; on next login, after password, user must submit TOTP (or backup code).

### 5.3 OAuth 2.0

- **OAuth-service:** Authorization code flow (with PKCE), client credentials, refresh; scope management.
- **Use:** Login via provider (e.g. Google); link identity to tenant/user.

### 5.4 SAML 2.0

- **SAML-service:** IdP metadata, SSO endpoint, attribute mapping.
- **Use:** Enterprise customers use corporate IdP for SSO.

### 5.5 RBAC

- **Roles:** Platform operator (internal), Admin, HRBP, Manager, Employee, Viewer, Contract Manager, Recruiter, Payroll Admin, Finance Admin, IT Admin, Project Manager, Contractor, etc. (see shared_libs models). The platform operator portal is not exposed in public UI; users with that role are redirected after login.
- **Enforcement:** Middleware/guards in frontend; API validates role/scope in gateway or service layer (e.g. `require_role` dependency). Contract Team uses `contract_manager` role for create/send/sign contracts.

---

## 6. Data Design

### 6.1 Tenant Isolation

- **Tenant ID:** Present in JWT and/or `X-Tenant-ID` header.
- **Data:** All tenant-scoped tables have `tenant_id` (or equivalent); queries always filter by tenant.
- **Shared_libs:** Provides `get_tenant_id(request)` and DB session per request.

### 6.2 PostgreSQL (Auth, Core HR, Compliance)

- **Auth-service:** tenants (including optional `code` for tenant-code login), users, roles, permissions, tenant_users, user_roles.
- **Employee-service:** employees, invitations, etc.
- **I-9 / E-Verify / Immigration / LCA / PAF:** Each service owns its schema; tenant_id on all tenant-scoped tables.
- **Promo-service:** promo_codes, promo_code_usage.
- **Contract-service:** contracts, contract_parties, contract_signatures (MSA, NDA, PO, WO, SOW).
- **Sessions:** SQLAlchemy; shared_libs provides `get_db_session_dependency()` for FastAPI.

### 6.3 MongoDB

- **Document-service:** Document metadata and/or file storage (GridFS) for uploads; reference by tenant and entity (e.g. employee_id).

### 6.4 Redis

- **Cache:** Optional caching of hot data (e.g. tenant config, user profile).
- **Sessions / rate limit:** Rate limit counters; optional session store.
- **Shared_libs:** Redis client for gateway and services.

### 6.5 Events (RabbitMQ)

- **Producers:** Services publish domain events (e.g. user.created, employee.created, document.uploaded).
- **Consumers:** Services subscribe to events for cross-service workflows (e.g. notifications, audit, sync).
- **Envelope:** Event type, tenant_id, payload (JSON).

---

## 7. Service Design Principles

- **One concern per service:** Auth, employees, I-9, documents, etc. are separate services.
- **Stateless:** Services do not store request state; tenant and user from token/header.
- **Shared libraries:** Common code (DB, auth middleware, JWT, schemas, events) in `shared-libs`; installed in each service image.
- **Configuration:** Environment variables (e.g. POSTGRES_URI, REDIS_URI, JWT_SECRET, RABBITMQ_URI); no hardcoded secrets.
- **Health:** Each service exposes `/health` for readiness/liveness.

---

## 8. Security Design

- **TLS:** All production traffic over HTTPS.
- **Secrets:** JWT secret, DB passwords, API keys from environment or secret manager; never in code.
- **Input:** Validate and sanitize all inputs; use Pydantic schemas.
- **Output:** Do not leak stack traces or internal details to clients.
- **Audit:** Log security-relevant actions (login, role change, data export) with user, tenant, timestamp.

---

## 9. Deployment & Operations

- **Containers:** Each service has a Dockerfile; build context from `saas-backend` for shared-libs.
- **Compose:** `docker-compose.local.yml` for local run (postgres, redis, api-gateway, auth-service, promo-service).
- **Start script:** `./start-api.sh` brings up local API stack and waits for gateway health.
- **Frontend:** Next.js dev server (e.g. `xerobookz-frontend/START-NOW.sh`); production build deployable to Vercel or static host.
- **Kubernetes:** Optional Helm charts in `xerobookz-infrastructure` for k8s deployment.

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025 | | Initial TDD |
| 2.0 | 2025 | | Full platform scope (all modules); contract-service; RBAC roles; data design for contracts |
| 2.1 | 2026 | | Admin Web public routes; tenants.code in auth data model; F-PUB-* alignment |
