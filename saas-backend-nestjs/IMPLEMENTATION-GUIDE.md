# 🚀 XeroBookz Enterprise Implementation Guide

## Current Status

### ✅ Phase 1: Foundation (IN PROGRESS)

#### Shared Libraries
- ✅ Common utilities (decorators, filters, guards, interceptors)
- ✅ Database utilities (Prisma service)
- ✅ Auth utilities (JWT strategy, guards, password hashing)

#### Platform Core - Auth Service
- ✅ Complete NestJS service structure
- ✅ Prisma schema (User, Tenant, UserTenant, RefreshToken, Session)
- ✅ Authentication (register, login, refresh token, logout)
- ✅ JWT-based authentication
- ✅ Multi-tenant support
- ✅ Swagger/OpenAPI documentation
- ✅ Docker configuration

### ⏳ Next Steps

1. **Tenant Service** - Complete tenant management
2. **RBAC Service** - Roles, permissions, ABAC
3. **Billing Service** - Subscriptions, plans, usage tracking
4. **Website Module** - Website Builder, Blog, Forum, eLearning, Live Chat
5. **CRM Module** - Leads, Opportunities, Pipelines

## Architecture Overview

### Service Structure

Each NestJS service follows this pattern:

```
service-name/
├── src/
│   ├── main.ts                 # Bootstrap
│   ├── app.module.ts          # Root module
│   ├── config/                # Configuration
│   ├── domain/                # Domain entities (DDD)
│   ├── application/           # Use cases, DTOs
│   ├── infrastructure/        # Database, external services
│   └── presentation/          # Controllers, GraphQL resolvers
├── prisma/
│   └── schema.prisma         # Database schema
├── test/                      # Tests
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Multi-Tenancy

- **Strategy**: Shared database with tenant_id filtering
- **Header**: `X-Tenant-ID` required for all requests
- **Isolation**: Row-level security via Prisma middleware
- **Validation**: TenantGuard validates tenant ID on all requests

### Authentication Flow

1. User registers/logs in → Auth Service
2. Auth Service validates credentials
3. JWT tokens generated (access + refresh)
4. Access token includes: userId, email, tenantId, roles
5. Client stores tokens and includes access token in Authorization header
6. Services validate JWT via JwtAuthGuard

### Event-Driven Communication

- **Kafka**: For async event publishing/consuming
- **Redis**: For caching and message queues
- **Events**: Domain events (user.created, order.placed, etc.)

## Development Setup

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install PostgreSQL
psql --version

# Install Redis
redis-cli --version

# Install Docker (optional)
docker --version
```

### Setup Auth Service

```bash
cd platform-core/auth-service

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Start service
npm run start:dev
```

### Database Setup

```sql
-- Create database
CREATE DATABASE xerobookz_auth;

-- Or use connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/xerobookz_auth?schema=public"
```

## API Endpoints

### Auth Service (Port 9001)

#### Register
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "tenant-uuid" // Optional
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "tenantId": "tenant-uuid" // Optional
}
```

#### Refresh Token
```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-string"
}
```

#### Get Current User
```bash
GET /api/v1/auth/me
Authorization: Bearer <access-token>
X-Tenant-ID: <tenant-id>
```

#### Logout
```bash
POST /api/v1/auth/logout
Authorization: Bearer <access-token>
X-Tenant-ID: <tenant-id>

{
  "refreshToken": "refresh-token-string" // Optional
}
```

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Manual Testing
```bash
# Use Swagger UI
http://localhost:9001/api/docs
```

## Deployment

### Docker
```bash
docker build -t xerobookz/auth-service:latest .
docker run -p 9001:9001 --env-file .env xerobookz/auth-service:latest
```

### Kubernetes
```yaml
# See xerobookz-infrastructure/k8s/ for K8s manifests
```

## Next Services to Build

### 1. Tenant Service (Priority: High)
- Tenant CRUD operations
- Tenant settings management
- Domain/subdomain management
- Tenant activation/deactivation

### 2. RBAC Service (Priority: High)
- Role management
- Permission management
- Role assignment
- ABAC policies

### 3. Billing Service (Priority: High)
- Subscription plans
- Usage tracking
- Billing cycles
- Payment processing integration

### 4. Website Builder Service (Priority: Medium)
- Page builder
- Theme management
- CMS functionality

### 5. CRM Service (Priority: Medium)
- Lead management
- Opportunity tracking
- Pipeline management
- Contact management

## Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Testing**: Jest for unit/integration tests
- **Documentation**: Swagger/OpenAPI for APIs
- **Git**: Conventional commits
- **Code Review**: Required before merge

## Security Checklist

- ✅ Password hashing (bcrypt)
- ✅ JWT token expiration
- ✅ Refresh token rotation
- ✅ Multi-tenant isolation
- ✅ Input validation (class-validator)
- ✅ SQL injection prevention (Prisma)
- ⏳ Rate limiting (to be added)
- ⏳ CORS configuration (to be added)
- ⏳ HTTPS enforcement (to be added)
- ⏳ Audit logging (to be added)

## Performance Considerations

- Database connection pooling (Prisma)
- Redis caching for frequently accessed data
- JWT token caching
- Query optimization
- Index optimization in Prisma schema

## Monitoring & Observability

- Structured logging (JSON format)
- Health check endpoints
- Metrics collection (Prometheus)
- Distributed tracing (OpenTelemetry)
- Error tracking (Sentry integration)

---

**Last Updated**: January 2025
**Status**: Phase 1 in progress - Auth Service complete, Tenant/RBAC/Billing next
