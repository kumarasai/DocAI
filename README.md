# DocuProperty AI

A complete production-ready multi-tenant SaaS platform that automates property registration and home-loan documentation. 

"Enter property details once. Generate the complete registration & loan document pack automatically."

## Architecture

This project is a monorepo structured as follows:
- `apps/web`: Next.js frontend application.
- `apps/api`: FastAPI backend providing REST APIs.
- `apps/worker`: Celery workers for async background processing (OCR, AI extraction).
- `packages/`: Shared packages or types if applicable.

## Getting Started

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Start the local infrastructure (Postgres, Redis, MinIO) and apps via Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Setup Database (Once `api` is running):
   ```bash
   # Run alembic migrations
   docker exec docuai_api alembic upgrade head
   
   # Run seed script
   docker exec docuai_api python scripts/seed.py
   ```

4. The API will be available at `http://localhost:8000`.
5. The Web app will be available at `http://localhost:3000`.
6. MinIO UI is at `http://localhost:9001`.

## Features
- Multi-tenant architecture (Organizations)
- RBAC (Role-based access control)
- Asynchronous OCR and AI extraction pipeline
- Dynamic document generator based on `.docx` templates
- Real-time background job updates
