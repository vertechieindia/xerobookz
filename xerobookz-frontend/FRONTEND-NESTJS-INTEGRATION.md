# 🎨 Frontend Integration with NestJS Services

## Overview

Complete frontend integration guide for XeroBookz NestJS microservices.

## API Clients

### New NestJS Client

Created `nestjs-client.ts` that handles:
- Multiple service endpoints
- JWT token management
- Tenant ID header injection
- Automatic token refresh
- Error handling

### Service Configuration

All NestJS services are configured with base URLs:

```typescript
const NESTJS_SERVICES = {
  auth: "http://localhost:9001/api/v1",
  crm: "http://localhost:9201/api/v1",
  projects: "http://localhost:9601/api/v1",
  // ... more services
};
```

## Created API Clients

### 1. CRM Client (`api-clients/src/crm/`)
- ✅ Leads management
- ✅ Opportunities
- ✅ Pipelines
- ✅ React Query hooks

### 2. Projects Client (`api-clients/src/projects/`)
- ✅ Projects CRUD
- ✅ Tasks management
- ✅ Kanban view
- ✅ Gantt view
- ✅ React Query hooks

## Frontend Pages

### Admin Web

#### CRM Page (`admin-web/app/crm/page.tsx`)
- Lead list with cards
- Lead scoring
- Status badges
- Create new lead

#### Projects Page (`admin-web/app/projects/page.tsx`)
- Project list
- Kanban view
- Gantt view (ready)
- Project cards with status

## Usage Example

```typescript
import { useLeads, useCreateLead } from "@xerobookz/api-clients";

function MyComponent() {
  const { data: leads, isLoading } = useLeads();
  const createLead = useCreateLead();

  const handleCreate = () => {
    createLead.mutate({
      name: "New Lead",
      email: "lead@example.com",
    });
  };

  return (
    <div>
      {leads?.map(lead => (
        <div key={lead.id}>{lead.name}</div>
      ))}
    </div>
  );
}
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:9001/api/v1
NEXT_PUBLIC_CRM_SERVICE_URL=http://localhost:9201/api/v1
NEXT_PUBLIC_PROJECTS_SERVICE_URL=http://localhost:9601/api/v1
NEXT_PUBLIC_TIMESHEETS_SERVICE_URL=http://localhost:9602/api/v1
NEXT_PUBLIC_DISCUSS_SERVICE_URL=http://localhost:9701/api/v1
# ... more services
```

## Next Steps

### To Add More Services:

1. **Create API Client**:
```typescript
// api-clients/src/timesheets/client.ts
import { nestjsClient } from "../core/nestjs-client";

export const timesheetsApi = {
  getEntries: async () => {
    return nestjsClient.get("timesheets", "/timesheets/entries");
  },
  // ... more methods
};
```

2. **Create React Query Hooks**:
```typescript
// api-clients/src/timesheets/hooks.ts
export const useTimesheetEntries = () => {
  return useQuery({
    queryKey: ["timesheets", "entries"],
    queryFn: () => timesheetsApi.getEntries(),
  });
};
```

3. **Create Frontend Page**:
```typescript
// admin-web/app/timesheets/page.tsx
"use client";
import { useTimesheetEntries } from "@xerobookz/api-clients";

export default function TimesheetsPage() {
  const { data: entries } = useTimesheetEntries();
  // ... render UI
}
```

## Services Ready for Integration

- ✅ CRM Service
- ✅ Projects Service
- ⏳ Timesheets Service
- ⏳ Discuss Service
- ⏳ Approvals Service
- ⏳ Knowledge Service
- ⏳ Studio Service

## Testing

1. Start NestJS services (see `saas-backend-nestjs/README-LOCAL.md`)
2. Start frontend:
```bash
cd xerobookz-frontend/admin-web
npm install
npm run dev
```
3. Navigate to:
   - CRM: http://localhost:3000/crm
   - Projects: http://localhost:3000/projects

---

**Status**: CRM and Projects integrated ✅  
**Next**: Add more services as needed
