import os
import uuid
import re
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from core.database import get_db
from models.template import DocumentTemplate, TemplateVersion
from models.auth import Organization
import docx

router = APIRouter()

UPLOAD_DIR = "uploads/templates"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def extract_placeholders(docx_path: str) -> List[str]:
    """Extracts all {{variable}} placeholders from a docx file."""
    doc = docx.Document(docx_path)
    placeholders = set()
    pattern = re.compile(r'\{\{(.*?)\}\}')
    
    for paragraph in doc.paragraphs:
        matches = pattern.findall(paragraph.text)
        for match in matches:
            placeholders.add(match.strip())
            
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    matches = pattern.findall(paragraph.text)
                    for match in matches:
                        placeholders.add(match.strip())
                        
    return list(placeholders)

@router.post("/upload")
async def upload_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are supported")
        
    # Generate unique ID and save file
    template_id = str(uuid.uuid4())
    filename = f"{template_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # Extract placeholders
    try:
        placeholders = extract_placeholders(filepath)
    except Exception as e:
        os.remove(filepath)
        raise HTTPException(status_code=400, detail=f"Failed to parse docx: {str(e)}")
        
    # For now, default mapping is placeholder -> placeholder
    field_mappings = {p: p for p in placeholders}
    
    # Ensure default organization exists
    org = db.query(Organization).filter(Organization.id == "default-org").first()
    if not org:
        org = Organization(id="default-org", name="Default Organization")
        db.add(org)
        db.commit()

    # Save to database
    template = DocumentTemplate(
        id=template_id,
        organization_id="default-org", 
        name=file.filename.replace(".docx", ""),
        description="Uploaded Template",
        document_type="Generic"
    )
    
    version = TemplateVersion(
        id=str(uuid.uuid4()),
        template_id=template_id,
        version_number="1.0",
        storage_key=filepath,
        published=True,
        field_mappings=field_mappings
    )
    
    db.add(template)
    db.add(version)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save template to database.")
        
    return {
        "id": template_id,
        "name": template.name,
        "placeholders": placeholders,
        "mappings": field_mappings
    }

@router.get("/")
def list_templates(db: Session = Depends(get_db)):
    # If DB works, return from DB. Otherwise return a mock list mixed with uploaded ones.
    # For the scope of this implementation, we will query the DB.
    try:
        templates = db.query(DocumentTemplate).all()
        result = []
        for t in templates:
            # Get latest version mappings
            version = db.query(TemplateVersion).filter(TemplateVersion.template_id == t.id).first()
            tags_count = len(version.field_mappings) if version and version.field_mappings else 0
            
            result.append({
                "id": t.id,
                "title": t.name,
                "subtitle": t.description,
                "tags": [f"{tags_count} auto-mapped tags"],
                "formats": [".DOCX"],
                "usage": "0 times",
                "modified": "Just now",
                "iconColor": "text-indigo-500",
                "iconBg": "bg-indigo-50",
                "mappings": version.field_mappings if version else {}
            })
        return result
    except Exception as e:
        # Fallback to empty list if DB isn't initialized properly
        return []
