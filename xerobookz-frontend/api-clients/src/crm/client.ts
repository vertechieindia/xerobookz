import { nestjsClient } from "../core/nestjs-client";
import { APIResponse } from "../types";

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  source?: string;
  score?: number;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  leadId?: string;
  name: string;
  amount?: number;
  stage: string;
  probability?: number;
  expectedCloseDate?: string;
  assignedToId?: string;
  pipelineId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: string[];
  isDefault: boolean;
}

export const crmApi = {
  // Leads
  getLeads: async (): Promise<APIResponse<Lead[]>> => {
    return nestjsClient.get("crm", "/leads");
  },

  getLead: async (id: string): Promise<APIResponse<Lead>> => {
    return nestjsClient.get("crm", `/leads/${id}`);
  },

  createLead: async (data: Partial<Lead>): Promise<APIResponse<Lead>> => {
    return nestjsClient.post("crm", "/leads", data);
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<APIResponse<Lead>> => {
    return nestjsClient.put("crm", `/leads/${id}`, data);
  },

  scoreLead: async (id: string): Promise<APIResponse<Lead>> => {
    return nestjsClient.post("crm", `/leads/${id}/score`);
  },

  convertToOpportunity: async (id: string, data: any): Promise<APIResponse<Opportunity>> => {
    return nestjsClient.post("crm", `/leads/${id}/convert`, data);
  },

  // Opportunities
  getOpportunities: async (): Promise<APIResponse<Opportunity[]>> => {
    return nestjsClient.get("crm", "/opportunities");
  },

  getOpportunity: async (id: string): Promise<APIResponse<Opportunity>> => {
    return nestjsClient.get("crm", `/opportunities/${id}`);
  },

  createOpportunity: async (data: Partial<Opportunity>): Promise<APIResponse<Opportunity>> => {
    return nestjsClient.post("crm", "/opportunities", data);
  },

  updateOpportunity: async (id: string, data: Partial<Opportunity>): Promise<APIResponse<Opportunity>> => {
    return nestjsClient.put("crm", `/opportunities/${id}`, data);
  },

  updateStage: async (id: string, stage: string): Promise<APIResponse<Opportunity>> => {
    return nestjsClient.put("crm", `/opportunities/${id}/stage`, { stage });
  },

  // Pipelines
  getPipelines: async (): Promise<APIResponse<Pipeline[]>> => {
    return nestjsClient.get("crm", "/pipelines");
  },

  getPipeline: async (id: string): Promise<APIResponse<Pipeline>> => {
    return nestjsClient.get("crm", `/pipelines/${id}`);
  },
};
