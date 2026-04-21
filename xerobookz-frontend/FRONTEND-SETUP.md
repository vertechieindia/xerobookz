# 🎨 XeroBookz Frontend - Complete Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd xerobookz-frontend

# Install shared packages first
cd ui-shared && npm install && npm run build
cd ../api-clients && npm install && npm run build

# Install web apps
cd ../admin-web && npm install
cd ../employer-web && npm install
cd ../ess-web && npm install
cd ../website-builder && npm install
```

### 2. Configure Environment Variables

Create `.env.local` in each web app:

**admin-web/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:9001/api/v1
NEXT_PUBLIC_CRM_SERVICE_URL=http://localhost:9201/api/v1
NEXT_PUBLIC_PROJECTS_SERVICE_URL=http://localhost:9601/api/v1
NEXT_PUBLIC_TIMESHEETS_SERVICE_URL=http://localhost:9602/api/v1
NEXT_PUBLIC_DISCUSS_SERVICE_URL=http://localhost:9701/api/v1
NEXT_PUBLIC_APPROVALS_SERVICE_URL=http://localhost:9702/api/v1
NEXT_PUBLIC_KNOWLEDGE_SERVICE_URL=http://localhost:9705/api/v1
NEXT_PUBLIC_STUDIO_SERVICE_URL=http://localhost:9801/api/v1
```

### 3. Start Services

**Terminal 1 - Start Backend Services**:
```bash
cd saas-backend-nestjs
./start-local.sh
```

**Terminal 2 - Start Frontend**:
```bash
cd xerobookz-frontend
./start-all.sh
```

Or start individually:
```bash
# Admin Web (Port 3000)
cd admin-web && npm run dev

# Employer Web (Port 3001)
cd employer-web && npm run dev

# ESS Web (Port 3002)
cd ess-web && npm run dev

# Website Builder (Port 3003)
cd website-builder && npm run dev
```

## Frontend Structure

```
xerobookz-frontend/
├── admin-web/              # Admin Portal (Port 3000)
│   ├── app/
│   │   ├── crm/           # ✅ CRM Page
│   │   ├── projects/      # ✅ Projects Page
│   │   ├── timesheets/    # ⏳ To be added
│   │   └── ...
│   └── ...
├── employer-web/           # Employer Portal (Port 3001)
├── ess-web/               # Employee Portal (Port 3002)
├── website-builder/        # Website Builder (Port 3003)
├── ui-shared/             # Shared UI Components
└── api-clients/           # API Client Library
    ├── src/
    │   ├── core/
    │   │   ├── client.ts          # Original client
    │   │   └── nestjs-client.ts   # ✅ NestJS services client
    │   ├── crm/                   # ✅ CRM API client
    │   ├── projects/              # ✅ Projects API client
    │   └── ...
```

## Available Pages

### Admin Web (localhost:3000)

- **Home**: `/` - Unified home page
- **CRM**: `/crm` - ✅ Lead management
- **Projects**: `/projects` - ✅ Project management with Kanban/Gantt
- **Timesheets**: `/timesheets` - ⏳ To be added
- **Discuss**: `/discuss` - ⏳ To be added
- **Approvals**: `/approvals` - ⏳ To be added
- **Knowledge**: `/knowledge` - ⏳ To be added
- **Studio**: `/studio` - ⏳ To be added

## API Clients Created

### ✅ CRM Client
- `useLeads()` - Get all leads
- `useLead(id)` - Get single lead
- `useCreateLead()` - Create lead
- `useUpdateLead()` - Update lead
- `useScoreLead()` - AI lead scoring
- `useOpportunities()` - Get opportunities
- `usePipelines()` - Get pipelines

### ✅ Projects Client
- `useProjects()` - Get all projects
- `useProject(id)` - Get single project
- `useCreateProject()` - Create project
- `useKanbanView(projectId)` - Get Kanban view
- `useGanttView(projectId)` - Get Gantt view
- `useTasks(projectId)` - Get project tasks
- `useCreateTask()` - Create task
- `useUpdateTaskStage()` - Update task stage

## Adding New Services

### Step 1: Create API Client

```typescript
// api-clients/src/timesheets/client.ts
import { nestjsClient } from "../core/nestjs-client";
import { APIResponse } from "../types";

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: string;
  hours: number;
  description?: string;
  isBillable: boolean;
}

export const timesheetsApi = {
  getEntries: async (): Promise<APIResponse<TimesheetEntry[]>> => {
    return nestjsClient.get("timesheets", "/timesheets/entries");
  },
  createEntry: async (data: Partial<TimesheetEntry>): Promise<APIResponse<TimesheetEntry>> => {
    return nestjsClient.post("timesheets", "/timesheets/entries", data);
  },
};
```

### Step 2: Create React Query Hooks

```typescript
// api-clients/src/timesheets/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timesheetsApi, TimesheetEntry } from "./client";

export const useTimesheetEntries = () => {
  return useQuery({
    queryKey: ["timesheets", "entries"],
    queryFn: async () => {
      const response = await timesheetsApi.getEntries();
      return response.data || [];
    },
  });
};

export const useCreateTimesheetEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TimesheetEntry>) => timesheetsApi.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets", "entries"] });
    },
  });
};
```

### Step 3: Export from Index

```typescript
// api-clients/src/timesheets/index.ts
export * from "./client";
export * from "./hooks";

// api-clients/src/index.ts
export * from "./timesheets";
```

### Step 4: Create Frontend Page

```typescript
// admin-web/app/timesheets/page.tsx
"use client";

import { useTimesheetEntries, useCreateTimesheetEntry } from "@xerobookz/api-clients";
import { Button } from "@xerobookz/ui-shared";

export default function TimesheetsPage() {
  const { data: entries, isLoading } = useTimesheetEntries();
  const createEntry = useCreateTimesheetEntry();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Timesheets</h1>
      {/* Your UI here */}
    </div>
  );
}
```

## Testing

### 1. Start Backend Services
```bash
cd saas-backend-nestjs
./start-local.sh
```

### 2. Start Frontend
```bash
cd xerobookz-frontend/admin-web
npm run dev
```

### 3. Test API Connection

Open browser console and test:
```javascript
// Should return leads
fetch('http://localhost:9201/api/v1/leads', {
  headers: {
    'X-Tenant-ID': 'your-tenant-id',
    'Authorization': 'Bearer your-token'
  }
}).then(r => r.json()).then(console.log)
```

## Troubleshooting

### API Client Not Found
```bash
cd api-clients
npm run build
```

### CORS Errors
Make sure backend services have `ALLOWED_ORIGINS` configured:
```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

### Token Issues
Check localStorage:
```javascript
localStorage.getItem('xerobookz_token')
localStorage.getItem('xerobookz_tenant_id')
```

## Next Steps

1. ✅ CRM integration complete
2. ✅ Projects integration complete
3. ⏳ Add Timesheets frontend
4. ⏳ Add Discuss/Chat frontend
5. ⏳ Add Approvals frontend
6. ⏳ Add Knowledge Base frontend
7. ⏳ Add Studio frontend

---

**Happy Coding! 🚀**
