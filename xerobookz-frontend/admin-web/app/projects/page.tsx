"use client";

import { useState } from "react";
import { useProjects, useCreateProject, useKanbanView } from "@xerobookz/api-clients";
import { Button } from "@xerobookz/ui-shared";
import { Plus, Kanban, GanttChart, TrendingUp } from "lucide-react";

export default function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "kanban" | "gantt">("list");
  const { data: projects, isLoading } = useProjects();
  const { data: kanbanData } = useKanbanView(selectedProjectId || "");
  const createProject = useCreateProject();

  if (isLoading) {
    return <div className="p-8">Loading projects...</div>;
  }

  if (selectedProjectId && (view === "kanban" || view === "gantt")) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProjectId(null);
                setView("list");
              }}
            >
              ← Back to Projects
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              onClick={() => setView("kanban")}
            >
              <Kanban className="w-4 h-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={(view as string) === "gantt" ? "default" : "outline"}
              onClick={() => setView("gantt")}
            >
              <GanttChart className="w-4 h-4 mr-2" />
              Gantt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {kanbanData?.stages && Object.entries(kanbanData.stages).map(([stage, tasks]: [string, any]) => (
            <div key={stage} className="bg-grey-50 rounded-lg p-4">
              <h3 className="font-semibold text-grey-900 mb-4 capitalize">{stage}</h3>
              <div className="space-y-2">
                {tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-grey-200"
                  >
                    <p className="text-sm font-medium text-grey-900">{task.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-grey-900">Projects</h1>
          <p className="text-grey-600 mt-1">Manage your projects and tasks</p>
        </div>
        <Button
          onClick={() => createProject.mutate({ name: "New Project", status: "draft" })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-grey-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedProjectId(project.id);
              setView("kanban");
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-grey-900">{project.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                project.status === "completed" ? "bg-green-100 text-green-700" :
                project.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                "bg-grey-100 text-grey-700"
              }`}>
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="text-sm text-grey-600 mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProjectId(project.id);
                    setView("kanban");
                  }}
                >
                  <Kanban className="w-4 h-4 mr-1" />
                  Kanban
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProjectId(project.id);
                    setView("gantt");
                  }}
                >
                  <GanttChart className="w-4 h-4 mr-1" />
                  Gantt
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-grey-600 mb-4">No projects yet</p>
          <Button onClick={() => createProject.mutate({ name: "New Project", status: "draft" })}>
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
