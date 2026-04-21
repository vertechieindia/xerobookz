import { apiClient } from "../core/client";
import {
  Timesheet,
  AttendanceRecord, AttendanceClockInRequest, AttendanceClockOutRequest,
  Schedule, ScheduleCreate, Shift, ShiftCreate
} from "./types";
import { APIResponse } from "../types";

export const timesheetApi = {
  getTimesheets: async (): Promise<APIResponse<Timesheet[]>> => {
    return apiClient.get("/timesheets");
  },

  getTimesheet: async (id: string): Promise<APIResponse<Timesheet>> => {
    return apiClient.get(`/timesheets/${id}`);
  },

  // ========== ENTERPRISE: TIME & ATTENDANCE ==========
  clockIn: async (data: AttendanceClockInRequest): Promise<APIResponse<AttendanceRecord>> => {
    return apiClient.post("/api/v1/timesheets/timesheet/attendance/clock-in", data);
  },

  clockOut: async (data: AttendanceClockOutRequest): Promise<APIResponse<AttendanceRecord>> => {
    return apiClient.post("/api/v1/timesheets/timesheet/attendance/clock-out", data);
  },

  getAttendanceRecords: async (employeeId?: string): Promise<APIResponse<AttendanceRecord[]>> => {
    const params = employeeId ? `?employee_id=${employeeId}` : "";
    return apiClient.get(`/api/v1/timesheets/timesheet/attendance/records${params}`);
  },

  createSchedule: async (data: ScheduleCreate): Promise<APIResponse<Schedule>> => {
    return apiClient.post("/api/v1/timesheets/timesheet/schedules", data);
  },

  getSchedules: async (employeeId?: string): Promise<APIResponse<Schedule[]>> => {
    const params = employeeId ? `?employee_id=${employeeId}` : "";
    return apiClient.get(`/api/v1/timesheets/timesheet/schedules${params}`);
  },

  createShift: async (data: ShiftCreate): Promise<APIResponse<Shift>> => {
    return apiClient.post("/api/v1/timesheets/timesheet/shifts", data);
  },
};

