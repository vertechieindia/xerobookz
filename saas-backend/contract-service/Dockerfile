FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY contract-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY shared-libs /app/shared-libs
RUN pip install -e /app/shared-libs || true

COPY contract-service/app /app/app

EXPOSE 8031

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8031"]
