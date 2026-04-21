# XeroBookz – Full Architecture
## Complete System Architecture Document

**Version:** 2.1  
**Last Updated:** 2026

---

## Totals at a glance

| Metric | Count |
|--------|--------|
| **Modules** | 10 |
| **Product services** | 54 |
| **Backend microservices** | 32 |
| **Data stores** | 3 (PostgreSQL, MongoDB, Redis) |
| **Message broker** | 1 (RabbitMQ) |

---

## 1. Architecture Overview

XeroBookz is a **multi-tenant, microservices-based SaaS platform** that delivers everything organizations need to run their entire business in one place: from customer management to manufacturing, from HR to finance—all integrated. The system consists of:

- **Frontend layer:** Web apps (Admin Web includes public marketing: landing, About Us, Contact, Privacy, Terms; authenticated portals for Company Admin, Employee, Contract Team; platform operator entry) and mobile app
- **API gateway:** Single entry point for all API traffic
- **Backend microservices:** 30+ services for Platform Core, HR, compliance, finance, Contract Team (e-signatures), and extensible for Website, Sales, Inventory & Manufacturing, Marketing, Services, Productivity, and Customization (see APPLICATION-BUSINESS-FEATURES)
- **Data layer:** PostgreSQL, MongoDB, Redis
- **Message layer:** RabbitMQ for event-driven communication
- **Infrastructure:** Docker, optional Kubernetes/Helm

**Platform modules (product scope):** Platform Core · Website · Sales · Finance · Inventory & Manufacturing · Human Resources · Marketing · Services · Productivity · Customization (Studio). Implemented services cover Platform Core, HR/immigration/compliance, invoicing/payments, Contract Team; other modules follow the same architecture as they are implemented.

---

## 2. High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Admin Web (Next.js :3000)  │  Employer Web  │  ESS Web  │  Mobile (React Native) │
└─────────────────────────────────────────────┬───────────────────────────────────┘
                                              │ HTTPS
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY (:8000)                                    │
│  • Route /api/v1/<service>/* to corresponding microservice                     │
│  • JWT validation, tenant extraction, rate limiting (Redis)                     │
│  • CORS, public routes: auth/login, auth/signup, auth/refresh, promo/validate    │
└─────────────────────────────────────────────┬───────────────────────────────────┘
                                              │
    ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
    │                                         │                                         │
    ▼                                         ▼                                         ▼
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│  IDENTITY & AUTH    │         │  CORE HR & ORG      │         │  COMPLIANCE         │
│  auth-service :8001 │         │  user :8002         │         │  i9 :8006           │
│  mfa-service :8028   │         │  organization :8003 │         │  everify :8007      │
│  oauth-service:8029 │         │  employee :8004     │         │  i9-audit :8008     │
│  saml-service :8030 │         │  document :8005     │         │  immigration :8011  │
│  promo-service:8027 │         │  onboarding :8018   │         │  lca :8012         │
│  super-admin :8026  │         │  workflow :8019     │         │  paf :8009         │
│                     │         │  timesheet :8013    │         │  soc-predictor:8010 │
│                     │         │  attendance :8032   │         │  safety :8017       │
│                     │         │  leave :8014       │         │                     │
└──────────┬──────────┘         └──────────┬──────────┘         └──────────┬──────────┘
           │                               │                               │
           │         ┌─────────────────────┼─────────────────────┐       │
           │         │                     │                     │       │
           ▼         ▼                     ▼                     ▼       ▼
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│  FINANCE & BILLING  │         │  SUPPORT & AI       │         │  NOTIFY & AUDIT     │
│  invoice :8020      │         │  notification :8015  │         │  audit :8016        │
│  payment :8021      │         │  ai-service :8025    │         │  marketing :8023    │
│  finance-dashboard  │         │  ess-service :8024   │         │                     │
│  :8022              │         │                     │         │                     │
└──────────┬──────────┘         └──────────┬──────────┘         └──────────┬──────────┘
           │                               │                               │
           └───────────────────────────────┼───────────────────────────────┘
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA & MESSAGING                                    │
├──────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│  PostgreSQL      │  MongoDB         │  Redis           │  RabbitMQ             │
│  (tenants,       │  (documents,     │  (cache,         │  (events, async        │
│   users, roles,  │   GridFS)        │   rate limit,    │   workflows)           │
│   employees,     │                  │   sessions)      │                        │
│   i9, immigration│                  │                  │                        │
└──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

---

## 3. Microservices Catalog

| Service | Port | Purpose |
|---------|------|---------|
| **api-gateway** | 8000 | Single entry; routing, auth, rate limit |
| **auth-service** | 8001 | Login, signup, JWT, roles, tenant-user |
| **user-service** | 8002 | User profile, CRUD |
| **organization-service** | 8003 | Organization/company profile |
| **employee-service** | 8004 | Employees, invitations, lifecycle |
| **document-service** | 8005 | Document upload, storage (MongoDB), metadata |
| **i9-service** | 8006 | Form I-9 digital completion |
| **e-verify-service** | 8007 | E-Verify integration |
| **i9-audit-service** | 8008 | I-9 audit trail and reporting |
| **paf-service** | 8009 | Public Access File (LCA compliance) |
| **soc-predictor-service** | 8010 | SOC code prediction/suggestion |
| **immigration-service** | 8011 | Immigration cases (e.g. H-1B) |
| **lca-service** | 8012 | Labor Condition Application |
| **timesheet-service** | 8013 | Timesheet entry and approval |
| **leave-service** | 8014 | Leave request and approval |
| **notification-service** | 8015 | Notifications (in-app, email, push) |
| **audit-service** | 8016 | Audit logging and query |
| **safety-service** | 8017 | Safety incidents/records |
| **onboarding-service** | 8018 | Onboarding workflows and checklist |
| **workflow-service** | 8019 | Generic workflow/approval engine |
| **invoice-service** | 8020 | Invoicing |
| **payment-service** | 8021 | Payment recording and tracking |
| **finance-dashboard-service** | 8022 | Finance KPIs and reports |
| **marketing-service** | 8023 | Campaigns, leads (internal/CRM) |
| **ess-service** | 8024 | Employee self-service API |
| **ai-service** | 8025 | AI/ML (document processing, suggestions) |
| **super-admin-service** | 8026 | Platform operator: tenants, API keys (internal; portal not in public UI) |
| **promo-service** | 8027 | Promo code validation and application |
| **mfa-service** | 8028 | TOTP MFA, backup codes |
| **oauth-service** | 8029 | OAuth 2.0 provider flows |
| **saml-service** | 8030 | SAML 2.0 SSO |
| **contract-service** | 8031 | Contracts (MSA, NDA, PO, WO, SOW): create, send, sign, AI quick-read |
| **attendance-service** | 8032 | Real-time punch/break events, geo/IP, session summaries, tenant toggle; integrates with timesheets |

**Planned / future service groups (same patterns):** Website (builder, blog, forum, eLearning, live chat), Sales (CRM, sales orders, POS, subscriptions, rental), Finance expansion (accounting, bookkeeping, expenses, spreadsheets), Inventory & Manufacturing, Marketing (automation, email, SMS, social, events, surveys), Services (projects, field service, helpdesk, planning, appointments), Productivity (chat, approvals, IoT, VoIP, knowledge base), Customization (Studio no-code). See BRD and APPLICATION-BUSINESS-FEATURES for full scope.

---

## 4. Request Flow (Typical)

1. **Client** sends request to `https://api.example.com/api/v1/auth/login` (or `/api/v1/employees`, etc.).
2. **API Gateway** receives request; if path is public (e.g. login, signup), skips JWT; else validates JWT and extracts tenant_id and user.
3. **Gateway** applies rate limit (Redis); forwards request to target service (e.g. auth-service:8001, attendance-service:8032) with same path and headers. Paths follow `/api/v1/<service>/...` (e.g. `/api/v1/attendance/punch`).
4. **Target service** uses tenant_id and user from context; executes business logic; reads/writes DB; may publish events to RabbitMQ.
5. **Response** returned through gateway to client.

---

## 5. Data Flow (Event-Driven)

- **Producer:** e.g. auth-service on signup publishes `user.created` with tenant_id, user_id, email.
- **Exchange:** RabbitMQ topic exchange; routing by event type and optional tenant.
- **Consumer:** e.g. notification-service sends welcome email; audit-service writes log; employee-service may create default profile.
- **Event envelope:** event_type, tenant_id, payload (JSON).

---

## 6. Multi-Tenancy Model

- **Tenant:** One organization (company). All data scoped by `tenant_id`.
- **Tenant isolation:** Enforced at API layer (JWT/header) and DB layer (WHERE tenant_id = ?).
- **Shared infrastructure:** All tenants use same services and DBs; no cross-tenant data access by design.

---

## 7. Security Architecture

- **Perimeter:** API Gateway is the only public API entry; internal services not exposed.
- **Authentication:** JWT (auth-service); optional MFA (mfa-service); OAuth/SAML for SSO.
- **Authorization:** RBAC per role; scope-based for OAuth clients; tenant in every request.
- **Secrets:** Env vars or secret manager; no secrets in code/repo.
- **Audit:** Sensitive and compliance actions logged (audit-service and/or local logs).

---

## 8. Deployment Topology

- **Local:** `./start-api.sh` → Docker Compose (postgres, redis, api-gateway, auth-service, promo-service). Frontend: `xerobookz-frontend/START-NOW.sh`.
- **Staging/Production:** Containers in Kubernetes (Helm in xerobookz-infrastructure); or Docker Compose on VMs. Frontend on Vercel or static host.
- **Databases:** PostgreSQL and MongoDB as managed services or self-hosted; Redis for cache and rate limit; RabbitMQ for events.

---

## 9. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025 | | Initial full architecture |
| 2.0 | 2025 | | Full platform scope; contract-service; planned module groups (Website, Sales, Finance, Inventory, HR, Marketing, Services, Productivity, Customization) |
| 2.1 | 2026 | | Admin Web public marketing pages (landing, About Us, Contact, Privacy, Terms); frontend layer description updated |
