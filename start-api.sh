#!/usr/bin/env bash
# Start local API stack (Postgres, Redis, API Gateway, Auth Service, Promo Service)
# API will be available at http://localhost:8000

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_DIR="${SCRIPT_DIR}/xerobookz-infrastructure/docker-compose"
COMPOSE_FILE="${COMPOSE_DIR}/docker-compose.local.yml"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Error: ${COMPOSE_FILE} not found."
  exit 1
fi

echo "Starting local API stack..."
cd "$COMPOSE_DIR"
docker compose -f docker-compose.local.yml up -d --build

echo ""
echo "Waiting for API gateway to be ready..."
for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health 2>/dev/null | grep -q 200; then
    echo "API is up at http://localhost:8000"
    echo "  Health: http://localhost:8000/health"
    echo "  Docs:   http://localhost:8000/docs"
    exit 0
  fi
  sleep 2
done

echo "Containers are up but /health did not return 200. Check: docker compose -f docker-compose.local.yml logs -f"
exit 0
