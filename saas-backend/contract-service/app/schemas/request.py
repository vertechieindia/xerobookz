"""Request schemas for contract-service"""

from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID


CONTRACT_TYPES = ["msa", "nda", "po", "wo", "sow", "other"]


class ContractCreateRequest(BaseModel):
    contract_type: str = Field(..., description="MSA, NDA, PO, WO, SOW, OTHER")
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None


class ContractSendRequest(BaseModel):
    recipients: List[str] = Field(..., description="List of recipient emails")
    message: Optional[str] = None


class ContractSignRequest(BaseModel):
    signature_data: Optional[str] = Field(None, description="Base64 signature image or typed name")
    signature_type: str = Field("typed", description="typed, drawn, image")
    accept: bool = Field(..., description="True to sign, False to decline")
