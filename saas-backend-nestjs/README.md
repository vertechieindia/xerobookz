# XeroBookz NestJS Backend

Enterprise-grade microservices backend built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Structure

```
saas-backend-nestjs/
├── shared/                      # Shared libraries
│   ├── common/                  # Common utilities
│   ├── database/                # Database utilities
│   ├── auth/                    # Auth utilities
│   ├── messaging/               # Kafka/Redis messaging
│   └── types/                   # Shared types
├── api-gateway/                 # API Gateway service
├── platform-core/               # Platform Core services
│   ├── auth-service/            # Authentication & Authorization
│   ├── tenant-service/          # Tenant management
│   ├── rbac-service/            # Role-based access control
│   └── billing-service/         # Billing & subscriptions
├── website/                     # Website module services
├── sales/                       # Sales module services
├── finance/                     # Finance module services
├── inventory/                   # Inventory & manufacturing services
├── hr/                          # HR module services
├── marketing/                   # Marketing module services
├── services/                     # Services module
├── productivity/                 # Productivity module services
└── customization/               # Customization module services
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Kafka (optional for local dev)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
cd platform-core/auth-service
npx prisma migrate dev
```

3. Start services:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Services

### Platform Core
- **auth-service** (Port 9001) - Authentication, JWT, SSO
- **tenant-service** (Port 9002) - Tenant management
- **rbac-service** (Port 9003) - Roles, permissions, ABAC
- **billing-service** (Port 9004) - Subscriptions, plans, usage

### Website Module
- **website-builder-service** (Port 9101)
- **blog-service** (Port 9102)
- **forum-service** (Port 9103)
- **elearning-service** (Port 9104)
- **live-chat-service** (Port 9105)

### Sales Module
- **crm-service** (Port 9201)
- **sales-orders-service** (Port 9202)
- **pos-service** (Port 9203)
- **subscriptions-service** (Port 9204)
- **rental-service** (Port 9205)

## Development

Each service is independently deployable and follows NestJS best practices:
- Domain-Driven Design (DDD)
- Clean Architecture
- Dependency Injection
- Event-driven communication
- Multi-tenancy support
