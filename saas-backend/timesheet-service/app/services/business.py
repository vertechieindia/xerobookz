"""Business logic for timesheet-service - Extended for Enterprise"""

from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../shared-libs"))
from shared_libs.models.enums import EventType
from shared_libs.schemas.events import EventEnvelope

from ..schemas.request import AttendanceClockInRequest, ScheduleCreate, ShiftCreate, RealtimeCloseRequest
from ..schemas.response import AttendanceRecordResponse, ScheduleResponse, ShiftResponse
from ..repositories.repo import TimesheetRepository
from ..events.producers import EventProducer


def _parse_iso_datetime(value: str) -> datetime:
    s = value.strip().replace("Z", "+00:00")
    dt = datetime.fromisoformat(s)
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


class TimesheetService:
    """Timesheet service - Extended for Enterprise"""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = TimesheetRepository(db)
        self.event_producer = EventProducer()
    
    async def clock_in(
        self,
        data: AttendanceClockInRequest,
        tenant_id: UUID
    ) -> AttendanceRecordResponse:
        """Clock in"""
        record = self.repo.create_attendance_record(data.employee_id, data.location, tenant_id)
        
        event = EventEnvelope(
            event_type=EventType.CLOCK_IN,
            tenant_id=tenant_id,
            payload={"record_id": str(record.id), "employee_id": str(data.employee_id)}
        )
        await self.event_producer.publish(event)
        
        return AttendanceRecordResponse.model_validate(record)
    
    async def clock_out(
        self,
        record_id: UUID,
        tenant_id: UUID
    ) -> AttendanceRecordResponse | None:
        """Clock out"""
        record = self.repo.update_attendance_record(record_id, tenant_id)
        if not record:
            return None
        
        event = EventEnvelope(
            event_type=EventType.CLOCK_OUT,
            tenant_id=tenant_id,
            payload={"record_id": str(record_id), "employee_id": str(record.employee_id)}
        )
        await self.event_producer.publish(event)
        
        return AttendanceRecordResponse.model_validate(record)
    
    async def get_attendance_records(
        self,
        tenant_id: UUID,
        employee_id: UUID | None = None
    ) -> list[AttendanceRecordResponse]:
        """Get attendance records"""
        records = self.repo.get_attendance_records(tenant_id, employee_id)
        return [AttendanceRecordResponse.model_validate(r) for r in records]

    async def record_realtime_session(
        self,
        data: RealtimeCloseRequest,
        tenant_id: UUID,
    ) -> AttendanceRecordResponse:
        """Create or update a timesheet row from a closed real-time attendance session."""
        cin = _parse_iso_datetime(data.clock_in)
        cout = _parse_iso_datetime(data.clock_out)
        src = data.timesheet_source if data.timesheet_source in ("manual", "attendance") else "attendance"
        record = self.repo.upsert_realtime_attendance_record(
            tenant_id,
            data.employee_id,
            cin,
            cout,
            data.hours_worked,
            src,
        )
        return AttendanceRecordResponse.model_validate(record)
    
    async def create_schedule(
        self,
        data: ScheduleCreate,
        tenant_id: UUID
    ) -> ScheduleResponse:
        """Create schedule"""
        schedule = self.repo.create_schedule(data, tenant_id)
        
        event = EventEnvelope(
            event_type=EventType.SCHEDULE_CREATED,
            tenant_id=tenant_id,
            payload={"schedule_id": str(schedule.id), "employee_id": str(data.employee_id)}
        )
        await self.event_producer.publish(event)
        
        return ScheduleResponse.model_validate(schedule)
    
    async def get_schedules(
        self,
        tenant_id: UUID,
        employee_id: UUID | None = None
    ) -> list[ScheduleResponse]:
        """Get schedules"""
        schedules = self.repo.get_schedules(tenant_id, employee_id)
        return [ScheduleResponse.model_validate(s) for s in schedules]
    
    async def create_shift(
        self,
        data: ShiftCreate,
        tenant_id: UUID
    ) -> ShiftResponse:
        """Create shift"""
        shift = self.repo.create_shift(data, tenant_id)
        return ShiftResponse.model_validate(shift)

