FROM python:3.11-slim

WORKDIR /app/worker

# Install system dependencies required for OCR and other native libraries
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Wait for API to copy models or share them via a volume/python package
# For now, we will run celery worker
CMD ["celery", "-A", "main.celery_app", "worker", "--loglevel=info"]
