import { apiClient } from "../core/client";
import { Employee, EmployeeCreate, EmployeeUpdate } from "./types";
import { APIResponse } from "../types";

export const employeeApi = {
  getEmployees: async (): Promise<APIResponse<Employee[]>> => {
    return apiClient.get("/api/v1/employees");
  },

  /** Employee row for the logged-in user (email match within tenant). */
  getMyEmployee: async (): Promise<APIResponse<Employee>> => {
    return apiClient.get("/api/v1/employees/me");
  },

  getEmployee: async (id: string): Promise<APIResponse<Employee>> => {
    return apiClient.get(`/api/v1/employees/${id}`);
  },

  createEmployee: async (data: EmployeeCreate): Promise<APIResponse<Employee>> => {
    return apiClient.post("/api/v1/employees", data);
  },

  updateEmployee: async (id: string, data: EmployeeUpdate): Promise<APIResponse<Employee>> => {
    return apiClient.patch(`/api/v1/employees/${id}`, data);
  },

  getEmployeeDocuments: async (id: string): Promise<APIResponse<any[]>> => {
    return apiClient.get(`/api/v1/employees/${id}/documents`);
  },
};

