FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (build context: saas-backend)
COPY auth-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy shared-libs
COPY shared-libs /app/shared-libs
RUN pip install -e /app/shared-libs || echo "Shared-libs not found, continuing..."

# Copy application
COPY auth-service/app /app/app

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8001/health')" || exit 1

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]

