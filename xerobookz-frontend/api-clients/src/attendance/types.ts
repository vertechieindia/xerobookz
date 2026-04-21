export type AttendanceEventType = "PUNCH_IN" | "PUNCH_OUT" | "BREAK_IN" | "BREAK_OUT";

export interface PunchRequest {
  event_type: AttendanceEventType;
  employee_id: string;
  geo_latitude?: number | null;
  geo_longitude?: number | null;
  geo_address?: string | null;
  timezone?: string;
  source?: "web" | "mobile";
}

export interface AttendanceEvent {
  id: string;
  tenant_id: string;
  employee_id: string;
  user_id?: string | null;
  event_type: string;
  timestamp_utc: string;
  timestamp_local: string;
  timezone: string;
  ip_address?: string | null;
  geo_latitude?: number | null;
  geo_longitude?: number | null;
  geo_address?: string | null;
  source: string;
  created_at: string;
}

export interface TenantAttendanceSettings {
  tenant_id: string;
  enable_realtime_attendance: boolean;
}

export interface SessionSummaryItem {
  session_start_utc: string;
  session_end_utc?: string | null;
  work_seconds: number;
  break_seconds: number;
  event_count: number;
}

export interface SessionSummaryResponse {
  employee_id: string;
  sessions: SessionSummaryItem[];
}
