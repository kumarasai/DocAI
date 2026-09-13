from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List
from core.database import get_db
from models import Case
from pydantic import BaseModel

router = APIRouter()

class CaseCreate(BaseModel):
    customer_id: str
    state: str
    district: str
    registration_office: str
    bank_name: str
    transaction_type: str

@router.post("/", response_model=dict)
def create_case(case_data: CaseCreate, db: Session = Depends(get_db)):
    # Placeholder for case creation
    return {"id": "test-case-123", "status": "DRAFT"}

@router.get("/", response_model=List[dict])
def list_cases(db: Session = Depends(get_db)):
    # Placeholder for case listing
    return []

@router.get("/{case_id}", response_model=dict)
def get_case(case_id: str, db: Session = Depends(get_db)):
    # Placeholder for get case
    return {"id": case_id, "status": "DRAFT"}
