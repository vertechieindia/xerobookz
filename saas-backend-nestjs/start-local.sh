#!/bin/bash

set -e

echo "🚀 Starting XeroBookz NestJS Services Locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 -U xerobookz > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not running. Starting with Docker..."
    docker run -d --name xerobookz-postgres \
        -e POSTGRES_USER=xerobookz \
        -e POSTGRES_PASSWORD=xerobookz_dev \
        -e POSTGRES_DB=xerobookz \
        -p 5432:5432 \
        postgres:15-alpine
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Function to start a service
start_service() {
    local service_path=$1
    local service_name=$2
    local port=$3
    
    if [ -d "$service_path" ]; then
        echo "📦 Starting $service_name..."
        cd "$service_path"
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            echo "   Installing dependencies..."
            npm install
        fi
        
        # Generate Prisma client
        if [ -d "prisma" ]; then
            echo "   Generating Prisma client..."
            npx prisma generate
        fi
        
        # Run migrations (optional, uncomment if needed)
        # npx prisma migrate dev --name init
        
        # Start service in background
        npm run start:dev > "/tmp/xerobookz-${service_name}.log" 2>&1 &
        echo "   ✅ $service_name started on port $port (logs: /tmp/xerobookz-${service_name}.log)"
        
        cd - > /dev/null
    else
        echo "   ⚠️  $service_path not found, skipping..."
    fi
}

# Start services
echo ""
echo "🔧 Starting services..."

# Platform Core
start_service "./platform-core/auth-service" "auth-service" "9001"

# Website
start_service "./website/website-builder-service" "website-builder-service" "9101"

# Sales
start_service "./sales/crm-service" "crm-service" "9201"

# Inventory
start_service "./inventory/inventory-service" "inventory-service" "9301"

# HR
start_service "./hr/employees-service" "employees-service" "9401"

# Marketing
start_service "./marketing/marketing-automation-service" "marketing-automation-service" "9501"
start_service "./marketing/email-marketing-service" "email-marketing-service" "9502"
start_service "./marketing/sms-marketing-service" "sms-marketing-service" "9503"
start_service "./marketing/events-service" "events-service" "9504"
start_service "./marketing/surveys-service" "surveys-service" "9505"

# Services
start_service "./services/project-service" "project-service" "9601"
start_service "./services/timesheets-service" "timesheets-service" "9602"

# Productivity
start_service "./productivity/discuss-service" "discuss-service" "9701"
start_service "./productivity/approvals-service" "approvals-service" "9702"
start_service "./productivity/iot-service" "iot-service" "9703"
start_service "./productivity/voip-service" "voip-service" "9704"
start_service "./productivity/knowledge-service" "knowledge-service" "9705"

# Customization
start_service "./customization/studio-service" "studio-service" "9801"

echo ""
echo "✅ All services are starting!"
echo ""
echo "📊 Service URLs:"
echo "   Platform Core:"
echo "   - Auth Service:              http://localhost:9001/api/docs"
echo ""
echo "   Website:"
echo "   - Website Builder:           http://localhost:9101/api/docs"
echo ""
echo "   Sales:"
echo "   - CRM Service:               http://localhost:9201/api/docs"
echo ""
echo "   Inventory:"
echo "   - Inventory Service:         http://localhost:9301/api/docs"
echo ""
echo "   HR:"
echo "   - Employees Service:         http://localhost:9401/api/docs"
echo ""
echo "   Marketing:"
echo "   - Marketing Automation:      http://localhost:9501/api/docs"
echo "   - Email Marketing:           http://localhost:9502/api/docs"
echo "   - SMS Marketing:             http://localhost:9503/api/docs"
echo "   - Events Service:            http://localhost:9504/api/docs"
echo "   - Surveys Service:           http://localhost:9505/api/docs"
echo ""
echo "   Services:"
echo "   - Project Management:        http://localhost:9601/api/docs"
echo "   - Timesheets:                http://localhost:9602/api/docs"
echo ""
echo "   Productivity:"
echo "   - Discuss:                   http://localhost:9701/api/docs"
echo "   - Approvals:                 http://localhost:9702/api/docs"
echo "   - IoT:                       http://localhost:9703/api/docs"
echo "   - VoIP:                      http://localhost:9704/api/docs"
echo "   - Knowledge:                 http://localhost:9705/api/docs"
echo ""
echo "   Customization:"
echo "   - Studio:                    http://localhost:9801/api/docs"
echo ""
echo "📝 View logs: tail -f /tmp/xerobookz-{service-name}.log"
echo "🛑 Stop all: pkill -f 'nest start'"
echo ""
