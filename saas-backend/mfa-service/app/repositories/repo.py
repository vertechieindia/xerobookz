"""Repository layer for MFA Service"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from uuid import UUID
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))

from ..models.db_models import MFADevice, MFABackupCode, MFASession


class MFARepository:
    """Repository for MFA operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_active_totp_device(self, user_id: UUID, tenant_id: UUID) -> MFADevice | None:
        """Get active TOTP device"""
        return self.db.query(MFADevice).filter(
            and_(
                MFADevice.user_id == user_id,
                MFADevice.tenant_id == tenant_id,
                MFADevice.device_type == "totp",
                MFADevice.is_active == True
            )
        ).first()
    
    def get_user_devices(self, user_id: UUID, tenant_id: UUID) -> list[MFADevice]:
        """Get all devices for user"""
        return self.db.query(MFADevice).filter(
            and_(
                MFADevice.user_id == user_id,
                MFADevice.tenant_id == tenant_id,
                MFADevice.is_active == True
            )
        ).all()
    
    def get_device(self, device_id: UUID, user_id: UUID, tenant_id: UUID) -> MFADevice | None:
        """Get device by ID"""
        return self.db.query(MFADevice).filter(
            and_(
                MFADevice.id == device_id,
                MFADevice.user_id == user_id,
                MFADevice.tenant_id == tenant_id
            )
        ).first()
    
    def get_unused_backup_codes(self, user_id: UUID, tenant_id: UUID) -> list[MFABackupCode]:
        """Get unused backup codes"""
        return self.db.query(MFABackupCode).filter(
            and_(
                MFABackupCode.user_id == user_id,
                MFABackupCode.tenant_id == tenant_id,
                MFABackupCode.is_used == False
            )
        ).all()
    
    def get_session(self, session_token: str) -> MFASession | None:
        """Get MFA session by token"""
        from datetime import datetime
        return self.db.query(MFASession).filter(
            and_(
                MFASession.session_token == session_token,
                MFASession.is_verified == True,
                MFASession.expires_at > datetime.utcnow()
            )
        ).first()
