# XeroBookz – Progress Document

**Purpose:** Snapshot of **what is implemented and where**, **what remains pending** at a high level, and **what should be tested manually** during local QA. For line-by-line feature status, see [APPLICATION-BUSINESS-FEATURES.md](APPLICATION-BUSINESS-FEATURES.md).

**Last updated:** 2026

---

## 1. What has been done (and where)

### 1.1 Local development & infrastructure

| Item | Location / how to run |
|------|------------------------|
| Docker Compose stack for core API | `xerobookz-infrastructure/docker-compose/docker-compose.local.yml` |
| One-command API startup | `./start-api.sh` (repo root) |
| Frontend dev server | `xerobookz-frontend/START-NOW.sh` → **http://localhost:3000** |
| Operational notes | [RUN-LOCAL.md](RUN-LOCAL.md) |

**Services typically brought up locally:** PostgreSQL, Redis, API gateway (**:8000**), auth-service, promo-service, contract-service. (Other microservices exist in `saas-backend/` but are not all wired into this compose file.)

### 1.2 API gateway & routing

| Item | Location |
|------|----------|
| Single entry point, service routing, CORS, JSON/binary proxy | `saas-backend/api-gateway/app/main.py` |
| Routes include `auth`, `promo`, `contracts`, and many others per `SERVICE_ROUTES` | Same file |

### 1.3 Authentication & tenants

| Item | Location |
|------|----------|
| Signup (company + first admin), login, refresh, roles, tenant users listing | `saas-backend/auth-service/` |
| Tenant **code** (human-readable login, e.g. `XB…`), login by UUID or code | `auth-service` models, `AuthService.login`, `UserLogin` schema |
| Shared DB helpers / tenant middleware patterns | `saas-backend/shared-libs/` |
| Seed script: VerTechie LLC company admin (dev) | `saas-backend/auth-service/scripts/seed_vertechie_admin.py` |

### 1.4 Promo codes

| Item | Location |
|------|----------|
| Validate / apply promo (e.g. FREE2026) | `saas-backend/promo-service/` |

### 1.5 Contract Team (MSA, NDA, PO, WO, SOW, etc.)

| Item | Location |
|------|----------|
| Contract CRUD, send, sign, download, AI summary hook | `saas-backend/contract-service/` |
| Gateway route `contracts` → contract-service | `api-gateway/app/main.py` |
| Contract Manager dashboard & flows | `xerobookz-frontend/admin-web/app/contract-team/dashboard/` |
| Company admin: assign Contract Team role | `xerobookz-frontend/admin-web/app/company-admin/contract-team/` |
| Role `contract_manager` in shared enums / auth | `shared_libs/models/enums.py`, auth + frontend `lib/auth.ts`, `AuthGuard.tsx`, `middleware.ts` |

### 1.6 Frontend (Admin Web)

| Area | Location / routes |
|------|-------------------|
| Landing, modules showcase, CTAs | `admin-web/app/page.tsx` |
| About Us | `admin-web/app/about/page.tsx` |
| Contact, Privacy, Terms | `admin-web/app/contact/`, `privacy/`, `terms/` |
| Signup / login (Company Admin portal entry) | `admin-web/app/signup/`, `login/` |
| MFA | `admin-web/app/auth/mfa/` |
| Company admin dashboard & contract-team management | `admin-web/app/company-admin/` |
| Contract Team dashboard | `admin-web/app/contract-team/` |
| Platform operator entry (not marketed publicly) | `admin-web/app/super-admin-accessportal/`, `super-admin/` |
| API client defaulting to **localhost:8000** on localhost | `xerobookz-frontend/api-clients/src/core/client.ts` |
| Next.js rewrite `/api/v1/*` → API (optional path) | `admin-web/next.config.js` |
| Shared UI (e.g. logo) | `xerobookz-frontend/ui-shared/` |

### 1.7 Documentation

| Document | Role |
|----------|------|
| BRD, FSD, TDD, ARCHITECTURE, APPLICATION-BUSINESS-FEATURES | Product & technical source of truth |
| README | Overview + links |
| RUN-LOCAL | How to run API + frontend |
| **PROGRESS.md** (this file) | Implementation snapshot & manual QA focus |

---

## 2. What is pending (summary)

The **product vision** covers **10 modules**, **53 services**, and **250+** discrete features. Most **business modules** (Website builder, full CRM, manufacturing, marketing automation, etc.) are **documented** in [APPLICATION-BUSINESS-FEATURES.md](APPLICATION-BUSINESS-FEATURES.md) as **🔲 planned** or partial—not fully implemented in this repo’s current UI/backend paths.

**Representative gaps (non-exhaustive):**

- **Platform Core:** Password reset via email (🔲), tenant suspension (🔲), full subscription/billing UI and payment rails (🔲).
- **Website / Sales / Inventory / Marketing / Services / Productivity / Customization:** Large portions are **planned**; NestJS-style service folders under `saas-backend-nestjs/` may exist as scaffolding but are not the primary running path for the current Admin Web + Python gateway stack described above.
- **HR / compliance / I-9 / immigration:** Many Python microservices exist under `saas-backend/`; **not all** are included in `docker-compose.local.yml`; end-to-end flows need explicit compose wiring and manual validation.
- **AI features:** Contract AI summary depends on **ai-service** availability and configuration; local stack may omit `ai-service` unless added to compose.
- **Mobile app:** Out of scope for this progress snapshot unless separately built and tested.

Use **APPLICATION-BUSINESS-FEATURES.md** for authoritative ✅ vs 🔲 per feature row.

---

## 3. What to test manually (checklist)

Run manual tests **after** Docker is up, `./start-api.sh` succeeds, and the frontend is running ([RUN-LOCAL.md](RUN-LOCAL.md)).

### 3.1 Environment smoke tests

- [ ] `curl -s http://localhost:8000/health` returns success.
- [ ] Browser: **http://localhost:3000** loads the landing page.
- [ ] Browser: **http://localhost:3000/about** loads About Us; header/footer links to Privacy, Terms, Contact work.

### 3.2 Signup & promo

- [ ] **Sign up** a new company (email, password); optional promo **FREE2026** validates and signup completes without “Cannot reach server.”
- [ ] After signup, redirect to company admin (or login) behaves as expected; **tenant ID** or **tenant code** is knowable (signup response / email / DB—per your process).

### 3.3 Login (tenant ID or code)

- [ ] Login with **email**, **password**, and **tenant UUID** OR **tenant code** (e.g. seeded `XB000016272` for VerTechie after seed script).
- [ ] Wrong password / wrong tenant → sensible error (no crash).
- [ ] Seeded admin (if used): `saas-backend/auth-service/scripts/seed_vertechie_admin.py` — confirm login and redirect to **Company Admin** dashboard.

### 3.4 Role-based routing

- [ ] **Company Admin** lands on `/company-admin/dashboard` and can open **Contract Team** management where implemented.
- [ ] **Contract Manager** lands on `/contract-team/dashboard` (after role assignment).
- [ ] **Employee** path still routes to employee dashboard when using an employee-class role (if you create one).

### 3.5 Contract Team (if API + DB available)

- [ ] Create contract, list “sent” / “received,” send for signature, sign/decline as applicable.
- [ ] Download contract file if offered.
- [ ] **AI summary** button: confirm behavior when `ai-service` is down (graceful error) vs up.

### 3.6 MFA (if enabled for a test user)

- [ ] Login prompts MFA when `mfa_enabled`; verify flow at `/auth/mfa`.

### 3.7 Marketing / legal

- [ ] Contact form submits (currently may be client-side demo); Privacy & Terms pages render.

### 3.8 Regression

- [ ] No public marketing link advertises the platform-operator / “super admin” portal (internal entry only).

---

## 4. When to update this document

Update **PROGRESS.md** when you ship meaningful changes (new service in local compose, major module, or test focus). Keep detailed feature status in **APPLICATION-BUSINESS-FEATURES.md** and requirements in **BRD** / **FSD**.
