#!/bin/bash

set -e

echo "🚀 Starting XeroBookz Frontend on Port 3000..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Build shared packages first
echo ""
echo "📦 Building shared packages..."

if [ ! -d "ui-shared/node_modules" ]; then
    echo "  → Installing ui-shared..."
    cd ui-shared && npm install && cd ..
fi
cd ui-shared && npm run build && cd ..

if [ ! -d "api-clients/node_modules" ]; then
    echo "  → Installing api-clients..."
    cd api-clients && npm install && cd ..
fi
cd api-clients && npm run build && cd ..

# Start admin-web on port 3000
echo ""
echo "🌐 Starting Admin Web on port 3000..."
cd admin-web

if [ ! -d "node_modules" ]; then
    echo "  → Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "  → Creating .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:9001/api/v1
NEXT_PUBLIC_CRM_SERVICE_URL=http://localhost:9201/api/v1
NEXT_PUBLIC_PROJECTS_SERVICE_URL=http://localhost:9601/api/v1
NEXT_PUBLIC_TIMESHEETS_SERVICE_URL=http://localhost:9602/api/v1
NEXT_PUBLIC_DISCUSS_SERVICE_URL=http://localhost:9701/api/v1
NEXT_PUBLIC_APPROVALS_SERVICE_URL=http://localhost:9702/api/v1
NEXT_PUBLIC_KNOWLEDGE_SERVICE_URL=http://localhost:9705/api/v1
NEXT_PUBLIC_STUDIO_SERVICE_URL=http://localhost:9801/api/v1
EOF
fi

echo ""
echo "✅ Starting Next.js dev server..."
echo "   URL: http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

PORT=3000 npm run dev
