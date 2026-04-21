import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, Project, Task } from "./client";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectsApi.getProjects();
      return response.data || [];
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await projectsApi.getProject(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
  });
};

export const useKanbanView = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "kanban"],
    queryFn: async () => {
      const response = await projectsApi.getKanbanView(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useGanttView = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "gantt"],
    queryFn: async () => {
      const response = await projectsApi.getGanttView(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: async () => {
      const response = await projectsApi.getTasks(projectId);
      return response.data || [];
    },
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<Task> }) =>
      projectsApi.createTask(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
    },
  });
};

export const useUpdateTaskStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId, stage }: { projectId: string; taskId: string; stage: string }) =>
      projectsApi.updateTaskStage(projectId, taskId, stage),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "kanban"] });
    },
  });
};
