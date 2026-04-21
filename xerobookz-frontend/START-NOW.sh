#!/bin/bash

set -e

echo "🚀 Starting XeroBookz Frontend NOW..."
echo ""

cd "$(dirname "$0")"

# Step 1: Build shared packages
echo "📦 Step 1: Building shared packages..."
echo ""

echo "  → ui-shared..."
cd ui-shared
if [ ! -d "node_modules" ]; then
    echo "    Installing dependencies..."
    npm install --silent
fi
if [ ! -d "dist" ]; then
    echo "    Building..."
    npm run build --silent
fi
cd ..

echo "  → api-clients..."
cd api-clients
if [ ! -d "node_modules" ]; then
    echo "    Installing dependencies..."
    npm install --silent
fi
if [ ! -d "dist" ]; then
    echo "    Building..."
    npm run build --silent
fi
cd ..

# Step 2: Install admin-web dependencies
echo ""
echo "📦 Step 2: Installing admin-web dependencies..."
cd admin-web
if [ ! -d "node_modules" ]; then
    npm install --silent
fi
cd ..

# Step 3: Start the server
echo ""
echo "🌐 Step 3: Starting frontend server..."
echo ""
echo "✅ Frontend will be available at: http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

cd admin-web
PORT=3000 npm run dev
