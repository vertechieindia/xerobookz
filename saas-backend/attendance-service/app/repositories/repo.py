from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from uuid import UUID
from datetime import datetime
from typing import List, Optional, Tuple

from ..models.db_models import AttendanceEvent, TenantAttendanceSettings, AttendanceAuditLog


class AttendanceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_settings(self, tenant_id: UUID) -> Optional[TenantAttendanceSettings]:
        return (
            self.db.query(TenantAttendanceSettings)
            .filter(TenantAttendanceSettings.tenant_id == tenant_id)
            .first()
        )

    def upsert_settings(self, tenant_id: UUID, enable: bool) -> TenantAttendanceSettings:
        row = self.get_settings(tenant_id)
        if not row:
            row = TenantAttendanceSettings(tenant_id=tenant_id, enable_realtime_attendance=enable)
            self.db.add(row)
        else:
            row.enable_realtime_attendance = enable
        self.db.commit()
        self.db.refresh(row)
        return row

    def insert_event(self, event: AttendanceEvent) -> AttendanceEvent:
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def list_events(
        self,
        tenant_id: UUID,
        employee_id: Optional[UUID] = None,
        from_utc: Optional[datetime] = None,
        to_utc: Optional[datetime] = None,
    ) -> List[AttendanceEvent]:
        q = self.db.query(AttendanceEvent).filter(AttendanceEvent.tenant_id == tenant_id)
        if employee_id:
            q = q.filter(AttendanceEvent.employee_id == employee_id)
        if from_utc:
            q = q.filter(AttendanceEvent.timestamp_utc >= from_utc)
        if to_utc:
            q = q.filter(AttendanceEvent.timestamp_utc <= to_utc)
        return q.order_by(AttendanceEvent.timestamp_utc.asc()).all()

    def list_events_desc(self, tenant_id: UUID, employee_id: UUID) -> List[AttendanceEvent]:
        return (
            self.db.query(AttendanceEvent)
            .filter(
                and_(
                    AttendanceEvent.tenant_id == tenant_id,
                    AttendanceEvent.employee_id == employee_id,
                )
            )
            .order_by(desc(AttendanceEvent.timestamp_utc))
            .all()
        )

    def audit(self, tenant_id: UUID, user_id: Optional[UUID], employee_id: Optional[UUID], action: str, detail: Optional[str] = None):
        log = AttendanceAuditLog(
            tenant_id=tenant_id,
            user_id=user_id,
            employee_id=employee_id,
            action=action,
            detail=detail,
        )
        self.db.add(log)
        self.db.commit()
