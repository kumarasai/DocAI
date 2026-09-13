from sqlalchemy import Column, String, ForeignKey, Integer, Float, Enum, JSON, Boolean
from sqlalchemy.orm import relationship
import enum
import uuid
from .base import Base, TimestampMixin

class DocumentProcessingState(str, enum.Enum):
    UPLOADED = "UPLOADED"
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    OCR_COMPLETE = "OCR_COMPLETE"
    EXTRACTING = "EXTRACTING"
    VALIDATING = "VALIDATING"
    READY_FOR_REVIEW = "READY_FOR_REVIEW"
    APPROVED = "APPROVED"
    FAILED = "FAILED"

class SourceDocument(Base, TimestampMixin):
    __tablename__ = "source_documents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    document_type = Column(String, nullable=True) # Classifed type e.g. "sale_deed"
    filename = Column(String, nullable=False)
    size_bytes = Column(Integer)
    mime_type = Column(String)
    pages = Column(Integer, default=0)
    storage_key = Column(String, nullable=False)
    status = Column(Enum(DocumentProcessingState), default=DocumentProcessingState.UPLOADED)
    upload_user = Column(String, ForeignKey("users.id"))
    
    case = relationship("Case", back_populates="source_documents")
    extracted_fields = relationship("ExtractedField", back_populates="source_document", cascade="all, delete-orphan")

class ConfidenceEnum(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ExtractedField(Base, TimestampMixin):
    __tablename__ = "extracted_fields"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    source_document_id = Column(String, ForeignKey("source_documents.id"), nullable=False)
    
    field_name = Column(String, nullable=False) # e.g. "buyer_name"
    value = Column(String)
    page_number = Column(Integer)
    source_text = Column(String)
    confidence_score = Column(Float)
    confidence_level = Column(Enum(ConfidenceEnum))
    extraction_method = Column(String)
    
    source_document = relationship("SourceDocument", back_populates="extracted_fields")

class ValidationSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class ValidationResult(Base, TimestampMixin):
    __tablename__ = "validation_results"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    
    severity = Column(Enum(ValidationSeverity))
    field_name = Column(String, nullable=False)
    issue_type = Column(String, nullable=False) # MATCH, MISSING, CONFLICT
    details = Column(JSON) # e.g. {"sale_deed": "123/4", "ec": "123/5"}
    resolved = Column(Boolean, default=False)
    resolved_by = Column(String, ForeignKey("users.id"), nullable=True)
