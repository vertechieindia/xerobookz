"""Response schemas for contract-service"""

from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class ContractPartyResponse(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str]
    role: str
    status: str
    signed_at: Optional[datetime]

    class Config:
        from_attributes = True


class ContractResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    contract_type: str
    title: str
    description: Optional[str]
    file_name: Optional[str]
    status: str
    created_by: UUID
    created_at: datetime
    expires_at: Optional[datetime]
    parties: List[ContractPartyResponse] = []

    class Config:
        from_attributes = True


class ContractListResponse(BaseModel):
    contracts: List[ContractResponse]
    total: int


class ContractAISummaryResponse(BaseModel):
    summary: str
    recommendation: str  # sign, review_carefully, do_not_sign
    key_terms: List[str] = []
    risks: List[str] = []
