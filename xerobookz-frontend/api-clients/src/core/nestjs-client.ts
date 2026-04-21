import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from "axios";
import { APIResponse } from "../types";

// NestJS Services Base URLs
const NESTJS_SERVICES: Record<string, string> = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:9001/api/v1",
  website: process.env.NEXT_PUBLIC_WEBSITE_SERVICE_URL || "http://localhost:9101/api/v1",
  crm: process.env.NEXT_PUBLIC_CRM_SERVICE_URL || "http://localhost:9201/api/v1",
  inventory: process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL || "http://localhost:9301/api/v1",
  employees: process.env.NEXT_PUBLIC_EMPLOYEES_SERVICE_URL || "http://localhost:9401/api/v1",
  marketing: process.env.NEXT_PUBLIC_MARKETING_SERVICE_URL || "http://localhost:9501/api/v1",
  email: process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || "http://localhost:9502/api/v1",
  sms: process.env.NEXT_PUBLIC_SMS_SERVICE_URL || "http://localhost:9503/api/v1",
  events: process.env.NEXT_PUBLIC_EVENTS_SERVICE_URL || "http://localhost:9504/api/v1",
  surveys: process.env.NEXT_PUBLIC_SURVEYS_SERVICE_URL || "http://localhost:9505/api/v1",
  projects: process.env.NEXT_PUBLIC_PROJECTS_SERVICE_URL || "http://localhost:9601/api/v1",
  timesheets: process.env.NEXT_PUBLIC_TIMESHEETS_SERVICE_URL || "http://localhost:9602/api/v1",
  discuss: process.env.NEXT_PUBLIC_DISCUSS_SERVICE_URL || "http://localhost:9701/api/v1",
  approvals: process.env.NEXT_PUBLIC_APPROVALS_SERVICE_URL || "http://localhost:9702/api/v1",
  iot: process.env.NEXT_PUBLIC_IOT_SERVICE_URL || "http://localhost:9703/api/v1",
  voip: process.env.NEXT_PUBLIC_VOIP_SERVICE_URL || "http://localhost:9704/api/v1",
  knowledge: process.env.NEXT_PUBLIC_KNOWLEDGE_SERVICE_URL || "http://localhost:9705/api/v1",
  studio: process.env.NEXT_PUBLIC_STUDIO_SERVICE_URL || "http://localhost:9801/api/v1",
};

class NestJSApiClient {
  private clients: Map<string, AxiosInstance> = new Map();

  private createClient(baseURL: string): AxiosInstance {
    const client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors(client);
    return client;
  }

  private getClient(service: string): AxiosInstance {
    const baseURL = NESTJS_SERVICES[service];
    if (!baseURL) {
      throw new Error(`Service ${service} not configured`);
    }

    if (!this.clients.has(service)) {
      this.clients.set(service, this.createClient(baseURL));
    }

    return this.clients.get(service)!;
  }

  private setupInterceptors(client: AxiosInstance) {
    // Request interceptor
    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const tenantId = this.getTenantId();
        if (tenantId && config.headers) {
          config.headers["X-Tenant-ID"] = tenantId;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await this.refreshToken();
          if (refreshed && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${this.getToken()}`;
            return client(originalRequest);
          }
          this.handleAuthError();
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
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

      const response = await axios.post(`${NESTJS_SERVICES.auth}/auth/refresh`, {
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

  async get<T = any>(
    service: string,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const client = this.getClient(service);
    const response = await client.get<APIResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    service: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const client = this.getClient(service);
    const response = await client.post<APIResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    service: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const client = this.getClient(service);
    const response = await client.put<APIResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    service: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const client = this.getClient(service);
    const response = await client.patch<APIResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(
    service: string,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const client = this.getClient(service);
    const response = await client.delete<APIResponse<T>>(url, config);
    return response.data;
  }
}

export const nestjsClient = new NestJSApiClient();
