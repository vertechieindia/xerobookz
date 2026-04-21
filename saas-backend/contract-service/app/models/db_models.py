"""Database models for contract-service - MSA, NDA, PO, WO, SOW, etc."""

from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, ForeignKey, LargeBinary
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.database.postgres import Base


class Contract(Base):
    """Contract document - MSA, NDA, PO, WO, SOW, etc."""

    __tablename__ = "contracts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    contract_type = Column(String(20), nullable=False)  # MSA, NDA, PO, WO, SOW, OTHER
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(500), nullable=True)
    file_content = Column(LargeBinary, nullable=True)  # PDF/document bytes; or use document_id to reference document-service
    file_content_type = Column(String(100), default="application/pdf")
    status = Column(String(20), default="draft")  # draft, sent, signed, expired, rejected
    created_by = Column(UUID(as_uuid=True), nullable=False, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    expires_at = Column(DateTime, nullable=True)

    parties = relationship("ContractParty", back_populates="contract", cascade="all, delete-orphan")
    signatures = relationship("ContractSignature", back_populates="contract", cascade="all, delete-orphan")


class ContractParty(Base):
    """Recipient or signer of a contract."""

    __tablename__ = "contract_parties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # if internal user
    email = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(20), default="signer")  # sender, signer, cc
    status = Column(String(20), default="pending")  # pending, signed, declined
    sent_at = Column(DateTime, nullable=True)
    signed_at = Column(DateTime, nullable=True)
    declined_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())

    contract = relationship("Contract", back_populates="parties")


class ContractSignature(Base):
    """E-signature record for a contract."""

    __tablename__ = "contract_signatures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    party_id = Column(UUID(as_uuid=True), ForeignKey("contract_parties.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    signature_data = Column(Text, nullable=True)  # base64 image or typed name
    signature_type = Column(String(20), default="typed")  # typed, drawn, image
    signed_at = Column(DateTime, default=func.now())
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)

    contract = relationship("Contract", back_populates="signatures")
