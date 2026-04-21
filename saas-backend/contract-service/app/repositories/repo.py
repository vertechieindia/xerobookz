"""Repository for contract-service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from uuid import UUID
from typing import Optional, List

from ..models.db_models import Contract, ContractParty, ContractSignature


class ContractRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, tenant_id: UUID, created_by: UUID, contract_type: str, title: str,
               description: Optional[str] = None, file_name: Optional[str] = None,
               file_content: Optional[bytes] = None, file_content_type: str = "application/pdf") -> Contract:
        c = Contract(
            tenant_id=tenant_id,
            created_by=created_by,
            contract_type=contract_type.lower(),
            title=title,
            description=description,
            file_name=file_name,
            file_content=file_content,
            file_content_type=file_content_type,
            status="draft",
        )
        self.db.add(c)
        self.db.flush()
        return c

    def get_by_id(self, contract_id: UUID, tenant_id: UUID) -> Optional[Contract]:
        return self.db.query(Contract).filter(
            and_(Contract.id == contract_id, Contract.tenant_id == tenant_id)
        ).first()

    def list_created_by(self, tenant_id: UUID, user_id: UUID, status: Optional[str] = None) -> List[Contract]:
        q = self.db.query(Contract).filter(
            and_(Contract.tenant_id == tenant_id, Contract.created_by == user_id)
        )
        if status:
            q = q.filter(Contract.status == status)
        return q.order_by(Contract.created_at.desc()).all()

    def list_received_by(self, tenant_id: UUID, user_id: UUID, email: str) -> List[Contract]:
        """Contracts where user is a party (recipient) and status pending/sent."""
        return self.db.query(Contract).join(ContractParty).filter(
            Contract.tenant_id == tenant_id,
            or_(ContractParty.user_id == user_id, ContractParty.email == email),
            ContractParty.status == "pending",
            Contract.status == "sent",
        ).order_by(Contract.updated_at.desc()).distinct().all()

    def add_party(self, contract_id: UUID, email: str, user_id: Optional[UUID] = None,
                  full_name: Optional[str] = None, role: str = "signer") -> ContractParty:
        p = ContractParty(
            contract_id=contract_id,
            user_id=user_id,
            email=email,
            full_name=full_name,
            role=role,
            status="pending",
        )
        self.db.add(p)
        self.db.flush()
        return p

    def get_party_by_contract_and_email(self, contract_id: UUID, email: str) -> Optional[ContractParty]:
        return self.db.query(ContractParty).filter(
            and_(ContractParty.contract_id == contract_id, ContractParty.email == email)
        ).first()

    def get_party_by_contract_and_user(self, contract_id: UUID, user_id: UUID) -> Optional[ContractParty]:
        return self.db.query(ContractParty).filter(
            and_(ContractParty.contract_id == contract_id, ContractParty.user_id == user_id)
        ).first()

    def update_contract_status(self, contract_id: UUID, status: str):
        self.db.query(Contract).filter(Contract.id == contract_id).update({"status": status})
        self.db.flush()

    def save_signature(self, contract_id: UUID, party_id: Optional[UUID], user_id: UUID,
                      signature_data: Optional[str], signature_type: str,
                      ip_address: Optional[str] = None, user_agent: Optional[str] = None) -> ContractSignature:
        sig = ContractSignature(
            contract_id=contract_id,
            party_id=party_id,
            user_id=user_id,
            signature_data=signature_data,
            signature_type=signature_type,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        self.db.add(sig)
        self.db.flush()
        return sig
