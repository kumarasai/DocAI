from sqlalchemy import Column, String, ForeignKey, Float, Date, Enum, Integer
from sqlalchemy.orm import relationship
import enum
import uuid
from .base import Base, TimestampMixin

class CaseStatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    PROCESSING = "PROCESSING"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    READY = "READY"
    APPROVAL_PENDING = "APPROVAL_PENDING"
    APPROVED = "APPROVED"
    COMPLETED = "COMPLETED"

class Customer(Base, TimestampMixin):
    __tablename__ = "customers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    pan = Column(String)
    aadhaar_masked = Column(String)
    
    cases = relationship("Case", back_populates="customer")

class Case(Base, TimestampMixin):
    __tablename__ = "cases"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String, unique=True, index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    
    state = Column(String)
    district = Column(String)
    registration_office = Column(String)
    bank_name = Column(String)
    transaction_type = Column(String)
    
    status = Column(Enum(CaseStatusEnum), default=CaseStatusEnum.DRAFT)
    
    organization = relationship("Organization", back_populates="cases")
    customer = relationship("Customer", back_populates="cases")
    created_by_user = relationship("User", back_populates="cases_created", foreign_keys=[created_by])
    
    properties = relationship("Property", back_populates="case", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="case", uselist=False, cascade="all, delete-orphan")
    source_documents = relationship("SourceDocument", back_populates="case", cascade="all, delete-orphan")

class Property(Base, TimestampMixin):
    __tablename__ = "properties"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    survey_number = Column(String)
    plot_number = Column(String)
    extent = Column(String)
    village = Column(String)
    mandal = Column(String)
    district = Column(String)
    registration_district = Column(String)
    sro = Column(String)
    address = Column(String)
    description = Column(String)
    
    case = relationship("Case", back_populates="properties")

class Transaction(Base, TimestampMixin):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    sale_consideration = Column(Float)
    loan_amount = Column(Float)
    registration_date = Column(Date)
    agreement_date = Column(Date)
    loan_type = Column(String)
    
    case = relationship("Case", back_populates="transactions")
