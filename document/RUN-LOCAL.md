# Run XeroBookz Locally

Follow these steps so **signup, login, and promo** work end-to-end.

---

## Step 1: Start Docker

**Required.** The API stack runs in Docker. Start Docker Desktop (or your Docker daemon) before running the scripts below.

---

## Step 2: Start the API

From the repo root:

```bash
./start-api.sh
```

This starts PostgreSQL, Redis, API gateway (port 8000), auth service, and promo service. Wait until you see: *"API is up at http://localhost:8000"*.

---

## Step 3: Start the frontend

```bash
cd xerobookz-frontend
bash START-NOW.sh
```

Open **http://localhost:3000**. Signup and login will work once the API is running.

---

## Quick start (frontend only)

If you only want to browse the UI without creating an account:

```bash
cd xerobookz-frontend
bash START-NOW.sh
```

Open **http://localhost:3000**. Signup, login, and promo validation will fail until you complete Step 1 and Step 2 above.

---

## Full stack (reference)

### API details

The API will be available at **http://localhost:8000**. The frontend proxies `/api/v1/*` to it via Next.js rewrites (no `NEXT_PUBLIC_API_URL` needed for local dev).

**Alternative:** Run only databases, then start services manually from `xerobookz-infrastructure/docker-compose` with `docker-compose.minimal.yml` and `docker-compose.local.yml`.

**Test signup:** Open **http://localhost:3000/signup**, fill company name, email, password, optionally use promo code **FREE2026**, then click **Create Account**. If you see *"Cannot reach server"*, ensure Docker is running and you ran `./start-api.sh` (Step 1 and 2).

**Company admin login (seed account):** To log in as a company admin with full access (e.g. VerTechie LLC), seed the account once, then use the Company Admin portal:

```bash
POSTGRES_URI=postgresql://xerobookz:xerobookz_dev@localhost:5432/xerobookz \
  python saas-backend/auth-service/scripts/seed_vertechie_admin.py
```

Then sign in at **http://localhost:3000/login** with:
- Email: `contracts@vertechie.com`
- Password: `Xerobookz@2026`
- Tenant ID or Code: `XB000016272`

---

## Promo code

- Code: **FREE2026** (case-insensitive: `free2026` or `FREE2026`).
- Valid for 2026 only (configured in DB, not hardcoded).
- One year free service.

To seed the promo in the DB (after Postgres and promo-service DB are set up):

```bash
cd saas-backend/promo-service
python scripts/init_promo_codes.py
```
