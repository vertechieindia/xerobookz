import { apiClient } from "../core/client";
import { LoginRequest, LoginResponse, UserResponse, RoleResponse } from "./types";
import { APIResponse } from "../types";

const P = "/api/v1/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<APIResponse<LoginResponse>> => {
    return apiClient.post(`${P}/login`, data);
  },

  refresh: async (refreshToken: string): Promise<APIResponse<LoginResponse>> => {
    return apiClient.post(`${P}/refresh`, { refresh_token: refreshToken });
  },

  logout: async (): Promise<APIResponse> => {
    return apiClient.post(`${P}/logout`);
  },

  getMe: async (): Promise<APIResponse<UserResponse>> => {
    return apiClient.get(`${P}/me`);
  },

  getRoles: async (): Promise<APIResponse<RoleResponse[]>> => {
    return apiClient.get(`${P}/roles`);
  },
};

