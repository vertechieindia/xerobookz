import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from "axios";
import { APIResponse } from "../types";

// In browser on localhost, hit API at 8000 directly so login/signup work without proxy. Otherwise use env or same-origin.
function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL)
    return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined" && window.location?.hostname === "localhost")
    return "http://localhost:8000";
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add JWT and tenant header
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Get token from cookie or storage
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Get tenant ID from storage or context
        const tenantId = this.getTenantId();
        if (tenantId && config.headers) {
          config.headers["X-Tenant-ID"] = tenantId;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt token refresh
            const refreshed = await this.refreshToken();
            if (refreshed) {
              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${this.getToken()}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - redirect to login
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    // Get from cookie or localStorage
    return localStorage.getItem("xerobookz_token") || null;
  }

  private getTenantId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("xerobookz_tenant_id") || null;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      if (typeof window === "undefined") return false;
      const refreshToken = localStorage.getItem("xerobookz_refresh_token");
      if (!refreshToken) return false;

      const base = getApiBaseUrl() || "";
      const response = await axios.post(`${base}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { data } = response.data as APIResponse;
      if (data?.access_token) {
        localStorage.setItem("xerobookz_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("xerobookz_refresh_token", data.refresh_token);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private handleAuthError() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("xerobookz_token");
      localStorage.removeItem("xerobookz_refresh_token");
      window.location.href = "/login";
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.get<APIResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await this.client.post<APIResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await this.client.put<APIResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await this.client.patch<APIResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.delete<APIResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

