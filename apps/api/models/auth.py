from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Enum
from sqlalchemy.orm import relationship
import enum
import uuid
from .base import Base, TimestampMixin

class RoleEnum(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN"
    MANAGER = "MANAGER"
    OPERATOR = "OPERATOR"
    VIEWER = "VIEWER"

class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    users = relationship("User", back_populates="organization")
    cases = relationship("Case", back_populates="organization")

class User(Base, TimestampMixin):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True) # Null for SUPER_ADMIN
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.VIEWER)
    is_active = Column(Boolean, default=True)

    organization = relationship("Organization", back_populates="users")
    
    # Audit trail
    cases_created = relationship("Case", back_populates="created_by_user", foreign_keys="Case.created_by")
