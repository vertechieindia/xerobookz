import { apiClient } from "../core/client";
import { APIResponse } from "../types";
import type {
  AttendanceEvent,
  PunchRequest,
  SessionSummaryResponse,
  TenantAttendanceSettings,
} from "./types";

export const attendanceApi = {
  getSettings: async (): Promise<APIResponse<TenantAttendanceSettings>> => {
    return apiClient.get("/api/v1/attendance/settings");
  },

  updateSettings: async (
    enableRealtime: boolean
  ): Promise<APIResponse<TenantAttendanceSettings>> => {
    return apiClient.patch("/api/v1/attendance/settings", {
      enable_realtime_attendance: enableRealtime,
    });
  },

  punch: async (body: PunchRequest): Promise<APIResponse<AttendanceEvent>> => {
    return apiClient.post("/api/v1/attendance/punch", body);
  },

  getMyEvents: async (
    employeeId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<APIResponse<AttendanceEvent[]>> => {
    const q = new URLSearchParams({ employee_id: employeeId });
    if (fromDate) q.set("from_date", fromDate);
    if (toDate) q.set("to_date", toDate);
    return apiClient.get(`/api/v1/attendance/my-events?${q.toString()}`);
  },

  getCompanyEvents: async (params: {
    employee_id?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<APIResponse<AttendanceEvent[]>> => {
    const q = new URLSearchParams();
    if (params.employee_id) q.set("employee_id", params.employee_id);
    if (params.from_date) q.set("from_date", params.from_date);
    if (params.to_date) q.set("to_date", params.to_date);
    return apiClient.get(`/api/v1/attendance/company?${q.toString()}`);
  },

  getSessionSummary: async (
    employeeId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<APIResponse<SessionSummaryResponse>> => {
    const q = new URLSearchParams({ employee_id: employeeId });
    if (fromDate) q.set("from_date", fromDate);
    if (toDate) q.set("to_date", toDate);
    return apiClient.get(`/api/v1/attendance/session-summary?${q.toString()}`);
  },
};
