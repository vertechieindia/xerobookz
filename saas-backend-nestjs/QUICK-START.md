# 🚀 Quick Start - Run XeroBookz Locally

## Prerequisites

- Node.js 18+
- Docker (optional, for PostgreSQL)
- npm or yarn

## Fastest Way to Start

### 1. Start PostgreSQL (if not running)

```bash
docker run -d --name xerobookz-postgres \
  -e POSTGRES_USER=xerobookz \
  -e POSTGRES_PASSWORD=xerobookz_dev \
  -e POSTGRES_DB=xerobookz \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. Start All Services

```bash
cd saas-backend-nestjs
./start-local.sh
```

Or with Docker Compose:

```bash
cd saas-backend-nestjs
docker compose up -d
```

### 3. Access Services

All services have Swagger docs at:
- Auth: http://localhost:9001/api/docs
- CRM: http://localhost:9201/api/docs
- Projects: http://localhost:9601/api/docs
- ... and more (see README-LOCAL.md)

## Start Single Service

```bash
cd platform-core/auth-service
npm install
cp .env.example .env
npx prisma generate
npm run start:dev
```

## Stop Services

```bash
# If using start-local.sh
pkill -f 'nest start'

# If using Docker Compose
docker compose down
```

## Need Help?

See `README-LOCAL.md` for detailed instructions.
