export interface Timesheet {
  id: string;
  tenant_id: string;
  employee_id: string;
  period_start: string;
  period_end: string;
  status: string;
  total_hours: number;
  created_at: string;
  updated_at: string;
}

// ========== ENTERPRISE: TIME & ATTENDANCE TYPES ==========

export interface AttendanceRecord {
  id: string;
  tenant_id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string;
  location?: string;
  hours_worked?: string;
  overtime_hours: string;
  /** manual | attendance */
  record_source?: string;
  created_at: string;
}

export interface AttendanceClockInRequest {
  employee_id: string;
  location?: string;
}

export interface AttendanceClockOutRequest {
  employee_id: string;
  attendance_record_id: string;
}

export interface Schedule {
  id: string;
  tenant_id: string;
  employee_id: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleCreate {
  employee_id: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  is_recurring?: boolean;
}

export interface Shift {
  id: string;
  tenant_id: string;
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftCreate {
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_duration?: number;
}

