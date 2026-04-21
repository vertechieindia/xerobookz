FROM python:3.11-slim

WORKDIR /app

# Install system deps if needed
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies (build context: saas-backend)
COPY promo-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy shared-libs (promo-service uses shared_libs.database.postgres, shared_libs.schemas.response)
COPY shared-libs /app/shared-libs
RUN pip install -e /app/shared-libs || true

# Copy application
COPY promo-service/app /app/app

# Expose port
EXPOSE 8027

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8027"]
