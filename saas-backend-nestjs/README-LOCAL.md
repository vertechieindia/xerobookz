# 🚀 XeroBookz NestJS Services - Local Development Guide

Complete guide to running XeroBookz NestJS microservices locally.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - Running locally or via Docker
- **npm** or **yarn** package manager

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
cd saas-backend-nestjs

# Start all services with Docker
docker compose up -d

# View logs
docker compose logs -f auth-service

# Stop all services
docker compose down
```

### Option 2: Run Services Manually

```bash
cd saas-backend-nestjs

# Make script executable
chmod +x start-local.sh

# Start all services
./start-local.sh
```

### Option 3: Run Individual Services

```bash
# Example: Start Auth Service
cd platform-core/auth-service
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Service Ports

| Service | Port | Swagger Docs |
|---------|------|--------------|
| Auth Service | 9001 | http://localhost:9001/api/docs |
| Website Builder | 9101 | http://localhost:9101/api/docs |
| CRM Service | 9201 | http://localhost:9201/api/docs |
| Inventory Service | 9301 | http://localhost:9301/api/docs |
| Employees Service | 9401 | http://localhost:9401/api/docs |
| Marketing Automation | 9501 | http://localhost:9501/api/docs |
| Email Marketing | 9502 | http://localhost:9502/api/docs |
| SMS Marketing | 9503 | http://localhost:9503/api/docs |
| Events Service | 9504 | http://localhost:9504/api/docs |
| Surveys Service | 9505 | http://localhost:9505/api/docs |
| Project Service | 9601 | http://localhost:9601/api/docs |
| Timesheets Service | 9602 | http://localhost:9602/api/docs |
| Discuss Service | 9701 | http://localhost:9701/api/docs |
| Approvals Service | 9702 | http://localhost:9702/api/docs |
| IoT Service | 9703 | http://localhost:9703/api/docs |
| VoIP Service | 9704 | http://localhost:9704/api/docs |
| Knowledge Service | 9705 | http://localhost:9705/api/docs |
| Studio Service | 9801 | http://localhost:9801/api/docs |

## Database Setup

### Using Docker (Recommended)

```bash
# Start PostgreSQL
docker run -d --name xerobookz-postgres \
  -e POSTGRES_USER=xerobookz \
  -e POSTGRES_PASSWORD=xerobookz_dev \
  -e POSTGRES_DB=xerobookz \
  -p 5432:5432 \
  postgres:15-alpine
```

### Using Local PostgreSQL

1. Install PostgreSQL 15+
2. Create database:
```sql
CREATE DATABASE xerobookz;
CREATE USER xerobookz WITH PASSWORD 'xerobookz_dev';
GRANT ALL PRIVILEGES ON DATABASE xerobookz TO xerobookz;
```

## Environment Variables

Each service has a `.env.example` file. Copy it to `.env`:

```bash
cd platform-core/auth-service
cp .env.example .env
```

### Common Environment Variables

```env
# Database
DATABASE_URL="postgresql://xerobookz:xerobookz_dev@localhost:5432/xerobookz_auth?schema=public"

# Server
PORT=9001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# JWT (Auth Service)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key
REFRESH_TOKEN_EXPIRES_IN=7d

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-api-key
```

## Running Migrations

Each service uses Prisma for database management:

```bash
cd platform-core/auth-service

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database in Prisma Studio
npx prisma studio
```

## Testing Services

### Health Check

```bash
# Auth Service
curl http://localhost:9001/api/v1/health

# All services follow similar pattern
```

### API Testing with Swagger

1. Open http://localhost:9001/api/docs
2. Click "Authorize" and enter your JWT token
3. Test endpoints directly from the UI

### Example: Register User

```bash
curl -X POST http://localhost:9001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: your-tenant-id" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:9001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: your-tenant-id" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Development Workflow

### 1. Start Database

```bash
docker run -d --name xerobookz-postgres \
  -e POSTGRES_USER=xerobookz \
  -e POSTGRES_PASSWORD=xerobookz_dev \
  -e POSTGRES_DB=xerobookz \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. Start Shared Libraries

First, build shared libraries:

```bash
cd shared/common
npm install
npm run build

cd ../database
npm install
npm run build

cd ../auth
npm install
npm run build
```

### 3. Start Services

Use the start script or start individually:

```bash
# Using script
./start-local.sh

# Or individually
cd platform-core/auth-service
npm run start:dev
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :9001

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string
psql postgresql://xerobookz:xerobookz_dev@localhost:5432/xerobookz
```

### Prisma Issues

```bash
# Reset Prisma
npx prisma migrate reset

# Regenerate client
npx prisma generate

# View database
npx prisma studio
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild shared libraries
cd shared/common && npm run build
cd ../database && npm run build
cd ../auth && npm run build
```

## Project Structure

```
saas-backend-nestjs/
├── shared/                    # Shared libraries
│   ├── common/               # Common utilities
│   ├── database/             # Prisma service
│   └── auth/                 # Auth guards, strategies
├── platform-core/            # Core services
│   └── auth-service/
├── website/                  # Website services
│   └── website-builder-service/
├── sales/                    # Sales services
│   └── crm-service/
├── inventory/                # Inventory services
│   └── inventory-service/
├── hr/                       # HR services
│   └── employees-service/
├── marketing/                # Marketing services
│   ├── marketing-automation-service/
│   ├── email-marketing-service/
│   ├── sms-marketing-service/
│   ├── events-service/
│   └── surveys-service/
├── services/                 # Services module
│   ├── project-service/
│   └── timesheets-service/
├── productivity/             # Productivity services
│   ├── discuss-service/
│   ├── approvals-service/
│   ├── iot-service/
│   ├── voip-service/
│   └── knowledge-service/
└── customization/            # Customization services
    └── studio-service/
```

## Next Steps

1. **Set up Frontend**: See `xerobookz-frontend/README.md`
2. **Configure API Gateway**: Set up routing to services
3. **Set up Monitoring**: Add Prometheus/Grafana
4. **Add Testing**: Write unit and integration tests

## Support

For issues or questions:
- Check service logs: `/tmp/xerobookz-{service-name}.log`
- View Swagger docs: `http://localhost:{port}/api/docs`
- Check Prisma Studio: `npx prisma studio`

---

**Happy Coding! 🚀**
