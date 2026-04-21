import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crmApi, Lead, Opportunity, Pipeline } from "./client";

export const useLeads = () => {
  return useQuery({
    queryKey: ["crm", "leads"],
    queryFn: async () => {
      const response = await crmApi.getLeads();
      return response.data || [];
    },
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ["crm", "leads", id],
    queryFn: async () => {
      const response = await crmApi.getLead(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Lead>) => crmApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      crmApi.updateLead(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "leads", variables.id] });
    },
  });
};

export const useScoreLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => crmApi.scoreLead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads", id] });
    },
  });
};

export const useConvertToOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      crmApi.convertToOpportunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "opportunities"] });
    },
  });
};

export const useOpportunities = () => {
  return useQuery({
    queryKey: ["crm", "opportunities"],
    queryFn: async () => {
      const response = await crmApi.getOpportunities();
      return response.data || [];
    },
  });
};

export const useOpportunity = (id: string) => {
  return useQuery({
    queryKey: ["crm", "opportunities", id],
    queryFn: async () => {
      const response = await crmApi.getOpportunity(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Opportunity>) => crmApi.createOpportunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "opportunities"] });
    },
  });
};

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      crmApi.updateOpportunity(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "opportunities", variables.id] });
    },
  });
};

export const usePipelines = () => {
  return useQuery({
    queryKey: ["crm", "pipelines"],
    queryFn: async () => {
      const response = await crmApi.getPipelines();
      return response.data || [];
    },
  });
};
