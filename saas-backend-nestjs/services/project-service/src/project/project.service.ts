import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.project.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        projectType: data.projectType || 'project',
        priority: data.priority || 'normal',
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        currency: data.currency || 'USD',
        coverImage: data.coverImage,
        tags: data.tags || [],
        settings: data.settings || {},
      },
      include: {
        _count: {
          select: { tasks: true, milestones: true, members: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string; priority?: string }) {
    return this.prisma.project.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.priority && { priority: filters.priority }),
      },
      include: {
        _count: {
          select: { tasks: true, milestones: true, members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, tenantId },
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        milestones: {
          orderBy: { targetDate: 'asc' },
        },
        members: {
          include: {
            // Would include user info if user service available
          },
        },
        documents: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { timesheets: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        tags: data.tags,
        settings: data.settings,
      },
    });
  }

  async getKanbanView(tenantId: string, id: string) {
    const project = await this.findOne(tenantId, id);

    // Group tasks by stage
    const stages: Record<string, any[]> = {};
    project.tasks.forEach((task) => {
      if (!stages[task.stage]) {
        stages[task.stage] = [];
      }
      stages[task.stage].push(task);
    });

    return {
      project: {
        id: project.id,
        name: project.name,
      },
      stages,
    };
  }

  async getGanttView(tenantId: string, id: string) {
    const project = await this.findOne(tenantId, id);

    return {
      project: {
        id: project.id,
        name: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
      },
      tasks: project.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        dependencies: task.dependencies,
        assignedToId: task.assignedToId,
      })),
      milestones: project.milestones.map((m) => ({
        id: m.id,
        name: m.name,
        targetDate: m.targetDate,
        status: m.status,
      })),
    };
  }

  async getProfitability(tenantId: string, id: string) {
    const project = await this.findOne(tenantId, id);

    // Calculate costs from timesheets
    const timesheets = await this.prisma.timesheet.findMany({
      where: { tenantId, projectId: id },
    });

    const totalCost = timesheets.reduce((sum, ts) => {
      return sum + Number(ts.hours) * Number(ts.billingRate || 0);
    }, 0);

    // Calculate revenue (would come from invoices/sales orders)
    const revenue = 0; // Would integrate with invoicing service

    return {
      project: {
        id: project.id,
        name: project.name,
        budget: Number(project.budget || 0),
      },
      costs: {
        labor: totalCost,
        total: totalCost,
      },
      revenue,
      profit: revenue - totalCost,
      margin: revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0,
    };
  }

  async addMember(tenantId: string, projectId: string, data: any) {
    await this.findOne(tenantId, projectId);
    return this.prisma.projectMember.create({
      data: {
        tenantId,
        projectId,
        userId: data.userId,
        role: data.role || 'member',
        canEdit: data.canEdit || false,
        canView: data.canView !== undefined ? data.canView : true,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }
}
