#!/bin/bash

echo "🔍 Checking Frontend Status..."
echo ""

# Check if port 3000 is in use
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Port 3000 is in use"
    echo "   Process: $(lsof -ti:3000 | xargs ps -p | tail -1)"
    echo ""
    echo "🌐 Frontend should be available at: http://localhost:3000"
    echo ""
    # Try to access it
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Server is responding!"
    else
        echo "⚠️  Server is not responding yet (may still be starting)"
    fi
else
    echo "❌ Port 3000 is NOT in use"
    echo ""
    echo "To start the frontend, run:"
    echo "  cd xerobookz-frontend/admin-web"
    echo "  PORT=3000 npm run dev"
    echo ""
    echo "Or use the script:"
    echo "  cd xerobookz-frontend"
    echo "  ./START-NOW.sh"
fi

echo ""
echo "📝 Check logs: tail -f /tmp/xerobookz-frontend.log"
