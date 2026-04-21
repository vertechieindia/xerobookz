import { nestjsClient } from "../core/nestjs-client";
import { APIResponse } from "../types";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  stage: string;
  priority: string;
  assignedToId?: string;
  startDate?: string;
  endDate?: string;
  plannedHours?: number;
  remainingHours?: number;
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  getProjects: async (): Promise<APIResponse<Project[]>> => {
    return nestjsClient.get("projects", "/projects");
  },

  getProject: async (id: string): Promise<APIResponse<Project>> => {
    return nestjsClient.get("projects", `/projects/${id}`);
  },

  createProject: async (data: Partial<Project>): Promise<APIResponse<Project>> => {
    return nestjsClient.post("projects", "/projects", data);
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<APIResponse<Project>> => {
    return nestjsClient.put("projects", `/projects/${id}`, data);
  },

  getKanbanView: async (id: string): Promise<APIResponse<any>> => {
    return nestjsClient.get("projects", `/projects/${id}/kanban`);
  },

  getGanttView: async (id: string): Promise<APIResponse<any>> => {
    return nestjsClient.get("projects", `/projects/${id}/gantt`);
  },

  getProfitability: async (id: string): Promise<APIResponse<any>> => {
    return nestjsClient.get("projects", `/projects/${id}/profitability`);
  },

  // Tasks
  getTasks: async (projectId: string): Promise<APIResponse<Task[]>> => {
    return nestjsClient.get("projects", `/projects/${projectId}/tasks`);
  },

  createTask: async (projectId: string, data: Partial<Task>): Promise<APIResponse<Task>> => {
    return nestjsClient.post("projects", `/projects/${projectId}/tasks`, data);
  },

  updateTask: async (projectId: string, taskId: string, data: Partial<Task>): Promise<APIResponse<Task>> => {
    return nestjsClient.put("projects", `/projects/${projectId}/tasks/${taskId}`, data);
  },

  updateTaskStage: async (projectId: string, taskId: string, stage: string): Promise<APIResponse<Task>> => {
    return nestjsClient.put("projects", `/projects/${projectId}/tasks/${taskId}/stage`, { stage });
  },
};
