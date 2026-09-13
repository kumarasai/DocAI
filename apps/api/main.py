from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Trigger reload to pick up new .env key
from routers import auth, cases, templates, documents

app = FastAPI(
    title="DocuProperty AI API",
    description="API for DocuProperty AI platform",
    version="1.0.0",
)

from core.database import engine
from models.base import Base

# Create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(cases.router, prefix="/cases", tags=["cases"])
app.include_router(templates.router, prefix="/templates", tags=["templates"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
