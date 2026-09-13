from sqlalchemy import Column, String, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
import uuid
from .base import Base, TimestampMixin

class DocumentTemplate(Base, TimestampMixin):
    __tablename__ = "document_templates"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    document_type = Column(String, nullable=False)
    is_global = Column(Boolean, default=False)
    
    versions = relationship("TemplateVersion", back_populates="template", cascade="all, delete-orphan")

class TemplateVersion(Base, TimestampMixin):
    __tablename__ = "template_versions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    template_id = Column(String, ForeignKey("document_templates.id"), nullable=False)
    version_number = Column(String, nullable=False)
    storage_key = Column(String, nullable=False)
    published = Column(Boolean, default=False)
    
    # Mapping configuration e.g. {"BUYER_NAME": "applicants.name"}
    field_mappings = Column(JSON)
    
    template = relationship("DocumentTemplate", back_populates="versions")

class GeneratedDocument(Base, TimestampMixin):
    __tablename__ = "generated_documents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    template_version_id = Column(String, ForeignKey("template_versions.id"), nullable=False)
    
    filename = Column(String, nullable=False)
    storage_key = Column(String, nullable=False)
    document_format = Column(String, nullable=False) # PDF, DOCX
    
    approved = Column(Boolean, default=False)
    approved_by = Column(String, ForeignKey("users.id"), nullable=True)
