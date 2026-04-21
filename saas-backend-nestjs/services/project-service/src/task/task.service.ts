import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, projectId: string, data: any) {
    // Verify project exists
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.task.create({
      data: {
        tenantId,
        projectId,
        name: data.name,
        description: data.description,
        stage: data.stage || 'todo',
        priority: data.priority || 'normal',
        assignedToId: data.assignedToId,
        parentTaskId: data.parentTaskId,
        startDate: data.startDate,
        endDate: data.endDate,
        plannedHours: data.plannedHours,
        remainingHours: data.remainingHours || data.plannedHours,
        isRecurring: data.isRecurring || false,
        recurrenceRule: data.recurrenceRule,
        tags: data.tags || [],
        dependencies: data.dependencies || {},
      },
      include: {
        subtasks: true,
        _count: {
          select: { subtasks: true, timesheets: true },
        },
      },
    });
  }

  async findAll(tenantId: string, projectId: string, filters?: { stage?: string; assignedToId?: string }) {
    return this.prisma.task.findMany({
      where: {
        tenantId,
        projectId,
        ...(filters?.stage && { stage: filters.stage }),
        ...(filters?.assignedToId && { assignedToId: filters.assignedToId }),
      },
      include: {
        subtasks: true,
        _count: {
          select: { subtasks: true, timesheets: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(tenantId: string, projectId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, projectId, tenantId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        parentTask: {
          select: {
            id: true,
            name: true,
          },
        },
        subtasks: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(tenantId: string, projectId: string, id: string, data: any) {
    await this.findOne(tenantId, projectId, id);
    return this.prisma.task.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        stage: data.stage,
        priority: data.priority,
        assignedToId: data.assignedToId,
        startDate: data.startDate,
        endDate: data.endDate,
        plannedHours: data.plannedHours,
        remainingHours: data.remainingHours,
        tags: data.tags,
        dependencies: data.dependencies,
      },
      include: {
        subtasks: true,
      },
    });
  }

  async updateStage(tenantId: string, projectId: string, id: string, stage: string) {
    await this.findOne(tenantId, projectId, id);
    return this.prisma.task.update({
      where: { id },
      data: { stage },
    });
  }

  async delete(tenantId: string, projectId: string, id: string) {
    await this.findOne(tenantId, projectId, id);
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }
}
