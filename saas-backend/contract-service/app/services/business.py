"""Business logic for contract-service - create, send, sign, AI summary"""

from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from typing import Optional, List
import httpx
import io
import json

from ..models.db_models import Contract, ContractParty
from ..repositories.repo import ContractRepository
from ..schemas.request import CONTRACT_TYPES
from ..schemas.response import ContractResponse, ContractPartyResponse, ContractAISummaryResponse
from ..config import settings


class ContractService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ContractRepository(db)

    def _contract_to_response(self, c: Contract) -> ContractResponse:
        parties = [
            ContractPartyResponse(
                id=p.id,
                email=p.email,
                full_name=p.full_name,
                role=p.role,
                status=p.status,
                signed_at=p.signed_at,
            )
            for p in c.parties
        ]
        return ContractResponse(
            id=c.id,
            tenant_id=c.tenant_id,
            contract_type=c.contract_type,
            title=c.title,
            description=c.description,
            file_name=c.file_name,
            status=c.status,
            created_by=c.created_by,
            created_at=c.created_at,
            expires_at=c.expires_at,
            parties=parties,
        )

    async def create_contract(
        self,
        tenant_id: UUID,
        created_by: UUID,
        contract_type: str,
        title: str,
        description: Optional[str] = None,
        file_content: Optional[bytes] = None,
        file_name: Optional[str] = None,
        file_content_type: str = "application/pdf",
    ) -> ContractResponse:
        if contract_type.lower() not in CONTRACT_TYPES:
            contract_type = "other"
        c = self.repo.create(
            tenant_id=tenant_id,
            created_by=created_by,
            contract_type=contract_type.lower(),
            title=title,
            description=description,
            file_name=file_name,
            file_content=file_content,
            file_content_type=file_content_type,
        )
        self.db.commit()
        self.db.refresh(c)
        return self._contract_to_response(c)

    async def get_contract(self, contract_id: UUID, tenant_id: UUID) -> Optional[ContractResponse]:
        c = self.repo.get_by_id(contract_id, tenant_id)
        if not c:
            return None
        return self._contract_to_response(c)

    async def list_my_contracts(
        self, tenant_id: UUID, user_id: UUID, status: Optional[str] = None
    ) -> List[ContractResponse]:
        contracts = self.repo.list_created_by(tenant_id, user_id, status)
        return [self._contract_to_response(c) for c in contracts]

    async def list_received(
        self, tenant_id: UUID, user_id: UUID, email: str
    ) -> List[ContractResponse]:
        contracts = self.repo.list_received_by(tenant_id, user_id, email)
        return [self._contract_to_response(c) for c in contracts]

    async def send_contract(
        self,
        contract_id: UUID,
        tenant_id: UUID,
        user_id: UUID,
        recipients: List[str],
        message: Optional[str] = None,
    ) -> ContractResponse:
        c = self.repo.get_by_id(contract_id, tenant_id)
        if not c:
            return None
        if c.created_by != user_id:
            return None
        if c.status != "draft":
            return None
        for email in recipients:
            if email.strip():
                self.repo.add_party(contract_id, email.strip(), role="signer")
        self.db.refresh(c)
        for p in c.parties:
            p.sent_at = datetime.utcnow()
        self.repo.update_contract_status(contract_id, "sent")
        self.db.commit()
        self.db.refresh(c)
        return self._contract_to_response(c)

    async def sign_contract(
        self,
        contract_id: UUID,
        tenant_id: UUID,
        user_id: UUID,
        user_email: str,
        signature_data: Optional[str] = None,
        signature_type: str = "typed",
        accept: bool = True,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> Optional[ContractResponse]:
        c = self.repo.get_by_id(contract_id, tenant_id)
        if not c:
            return None
        party = self.repo.get_party_by_contract_and_email(contract_id, user_email) or \
                self.repo.get_party_by_contract_and_user(contract_id, user_id)
        if not party:
            return None
        if party.status != "pending":
            return None
        if accept:
            from datetime import datetime
            party.status = "signed"
            party.signed_at = datetime.utcnow()
            self.repo.save_signature(
                contract_id, party.id, user_id,
                signature_data, signature_type,
                ip_address, user_agent,
            )
            # If all parties signed, mark contract signed
            all_signed = all(p.status == "signed" for p in c.parties)
            if all_signed:
                self.repo.update_contract_status(contract_id, "signed")
        else:
            party.status = "declined"
            party.declined_at = datetime.utcnow()
            self.repo.update_contract_status(contract_id, "rejected")
        self.db.commit()
        self.db.refresh(c)
        return self._contract_to_response(c)

    async def get_ai_summary(
        self, contract_id: UUID, tenant_id: UUID, ai_service_base_url: Optional[str] = None
    ) -> Optional[ContractAISummaryResponse]:
        c = self.repo.get_by_id(contract_id, tenant_id)
        if not c:
            return None
        if not c.file_content:
            return ContractAISummaryResponse(
                summary="No document attached to this contract.",
                recommendation="review_carefully",
                key_terms=[],
                risks=[],
            )
        base_url = ai_service_base_url or settings.AI_SERVICE_URL
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                # Extract text via OCR (PDF) or document extraction
                files = {"file": (c.file_name or "document.pdf", io.BytesIO(c.file_content), c.file_content_type)}
                r = await client.post(f"{base_url}/ai/ocr", files=files)
                text = ""
                if r.status_code == 200:
                    data = r.json()
                    text = data.get("text", "") or ""
                if not text and r.status_code == 200:
                    ext = r.json().get("extracted_data", {})
                    text = json.dumps(ext) if ext else ""
                if not text:
                    return ContractAISummaryResponse(
                        summary="Could not extract text from document. Please review manually.",
                        recommendation="review_carefully",
                        key_terms=[],
                        risks=[],
                    )
                # Analyze/summarize
                analysis_r = await client.post(
                    f"{base_url}/ai/analyze-text",
                    json={"text": text[:50000], "analysis_type": "summary"},
                )
                summary = "No summary available."
                if analysis_r.status_code == 200:
                    ad = analysis_r.json()
                    summary = ad.get("analysis_result", ad.get("result", summary))
                    if isinstance(summary, dict):
                        summary = summary.get("summary", json.dumps(summary))
                recommendation = "review_carefully"
                if "do not sign" in summary.lower() or "avoid" in summary.lower():
                    recommendation = "do_not_sign"
                elif "standard" in summary.lower() or "routine" in summary.lower():
                    recommendation = "sign"
                return ContractAISummaryResponse(
                    summary=summary,
                    recommendation=recommendation,
                    key_terms=[],
                    risks=[],
                )
        except Exception:
            return ContractAISummaryResponse(
                summary="AI summary is temporarily unavailable. Please review the document manually.",
                recommendation="review_carefully",
                key_terms=[],
                risks=[],
            )

    async def get_document_content(self, contract_id: UUID, tenant_id: UUID) -> Optional[dict]:
        c = self.repo.get_by_id(contract_id, tenant_id)
        if not c or not c.file_content:
            return None
        return {
            "content": c.file_content,
            "file_name": c.file_name or "document.pdf",
            "content_type": c.file_content_type or "application/pdf",
        }
