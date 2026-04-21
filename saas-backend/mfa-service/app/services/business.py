"""Business logic for MFA Service"""

from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta
import pyotp
import qrcode
import io
import base64
import secrets
import hashlib
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))

from ..models.db_models import MFADevice, MFABackupCode, MFASession
from ..schemas.request import MFASetupRequest, MFAVerifyRequest, MFABackupCodeRequest
from ..schemas.response import MFASetupResponse, MFADeviceResponse, MFAVerifyResponse
from ..repositories.repo import MFARepository
from ..config import settings


class MFAService:
    """MFA business logic"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = MFARepository(db)
    
    async def setup_totp(
        self,
        user_id: UUID,
        tenant_id: UUID,
        request: MFASetupRequest
    ) -> MFASetupResponse:
        """Setup TOTP (Google/Microsoft Authenticator)"""
        # Generate secret
        secret = pyotp.random_base32()
        
        # Create device
        device = MFADevice(
            user_id=user_id,
            tenant_id=tenant_id,
            device_type="totp",
            device_name=request.device_name or "Authenticator App",
            secret_key=secret,  # In production, encrypt this
            is_active=True,
            is_verified=False
        )
        self.db.add(device)
        self.db.flush()
        
        # Generate QR code
        totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=f"{user_id}",
            issuer_name=settings.MFA_ISSUER
        )
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(totp_uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        qr_code_url = f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"
        
        # Generate backup codes
        backup_codes = self._generate_backup_codes(user_id, tenant_id)
        
        self.db.commit()
        self.db.refresh(device)
        
        return MFASetupResponse(
            device_id=device.id,
            qr_code_url=qr_code_url,
            secret_key=secret,
            backup_codes=backup_codes
        )
    
    async def verify_totp(
        self,
        user_id: UUID,
        tenant_id: UUID,
        request: MFAVerifyRequest
    ) -> MFAVerifyResponse:
        """Verify TOTP code"""
        # Get active TOTP device
        device = self.repo.get_active_totp_device(user_id, tenant_id)
        
        if not device:
            return MFAVerifyResponse(
                verified=False,
                message="No active TOTP device found"
            )
        
        # Verify code
        totp = pyotp.TOTP(device.secret_key)
        is_valid = totp.verify(request.code, valid_window=1)
        
        if not is_valid:
            return MFAVerifyResponse(
                verified=False,
                message="Invalid code"
            )
        
        # Mark device as verified and update last used
        device.is_verified = True
        device.last_used_at = datetime.utcnow()
        
        # Create session token
        session_token = secrets.token_urlsafe(32)
        session = MFASession(
            user_id=user_id,
            tenant_id=tenant_id,
            session_token=session_token,
            device_id=device.id,
            is_verified=True,
            expires_at=datetime.utcnow() + timedelta(minutes=10)
        )
        self.db.add(session)
        self.db.commit()
        
        return MFAVerifyResponse(
            verified=True,
            session_token=session_token,
            message="MFA verified successfully"
        )
    
    async def verify_backup_code(
        self,
        user_id: UUID,
        tenant_id: UUID,
        request: MFABackupCodeRequest
    ) -> MFAVerifyResponse:
        """Verify backup code"""
        # Get unused backup codes
        backup_codes = self.repo.get_unused_backup_codes(user_id, tenant_id)
        
        # Check if code matches
        code_hash = hashlib.sha256(request.backup_code.encode()).hexdigest()
        matching_code = None
        
        for bc in backup_codes:
            if bc.code_hash == code_hash:
                matching_code = bc
                break
        
        if not matching_code:
            return MFAVerifyResponse(
                verified=False,
                message="Invalid backup code"
            )
        
        # Mark code as used
        matching_code.is_used = True
        matching_code.used_at = datetime.utcnow()
        
        # Create session token
        session_token = secrets.token_urlsafe(32)
        session = MFASession(
            user_id=user_id,
            tenant_id=tenant_id,
            session_token=session_token,
            is_verified=True,
            expires_at=datetime.utcnow() + timedelta(minutes=10)
        )
        self.db.add(session)
        self.db.commit()
        
        return MFAVerifyResponse(
            verified=True,
            session_token=session_token,
            message="Backup code verified successfully"
        )
    
    def _generate_backup_codes(
        self,
        user_id: UUID,
        tenant_id: UUID
    ) -> ListType[str]:
        """Generate backup codes"""
        codes = []
        for _ in range(settings.BACKUP_CODE_COUNT):
            code = secrets.token_hex(4).upper()
            codes.append(code)
            
            # Store hashed code
            code_hash = hashlib.sha256(code.encode()).hexdigest()
            backup_code = MFABackupCode(
                user_id=user_id,
                tenant_id=tenant_id,
                code_hash=code_hash,
                is_used=False
            )
            self.db.add(backup_code)
        
        return codes
    
    async def get_devices(
        self,
        user_id: UUID,
        tenant_id: UUID
    ) -> List[MFADeviceResponse]:
        """Get all MFA devices for user"""
        devices = self.repo.get_user_devices(user_id, tenant_id)
        return [MFADeviceResponse.model_validate(d) for d in devices]
    
    async def delete_device(
        self,
        user_id: UUID,
        tenant_id: UUID,
        device_id: UUID
    ):
        """Delete MFA device"""
        device = self.repo.get_device(device_id, user_id, tenant_id)
        if not device:
            raise ValueError("Device not found")
        
        device.is_active = False
        self.db.commit()
