# 🚀 Quick Start - Frontend

## Start Frontend (Port 3000)

### Option 1: Use Start Script (Recommended)

```bash
cd xerobookz-frontend
./start-frontend.sh
```

This will:
1. Build shared packages (ui-shared, api-clients)
2. Install dependencies if needed
3. Start admin-web on port 3000

### Option 2: Manual Start

```bash
cd xerobookz-frontend

# Build shared packages
cd ui-shared && npm install && npm run build && cd ..
cd api-clients && npm install && npm run build && cd ..

# Start admin-web
cd admin-web
npm install
PORT=3000 npm run dev
```

## Access

Once started, open:
- **Admin Web**: http://localhost:3000
- **CRM**: http://localhost:3000/crm
- **Projects**: http://localhost:3000/projects

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)
```

### Build Errors
```bash
# Rebuild shared packages
cd ui-shared && npm run build
cd ../api-clients && npm run build
```

### Module Not Found
```bash
# Reinstall all dependencies
cd admin-web
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

The `.env.local` file is already created with all NestJS service URLs. Make sure your backend services are running!

See `saas-backend-nestjs/README-LOCAL.md` for backend setup.
