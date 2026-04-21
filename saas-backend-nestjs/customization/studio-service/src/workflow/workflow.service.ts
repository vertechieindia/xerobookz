import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.workflow.create({
      data: {
        tenantId,
        appId: data.appId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        actions: data.actions || [],
      },
    });
  }

  async findAll(tenantId: string, filters?: { appId?: string; isActive?: boolean }) {
    return this.prisma.workflow.findMany({
      where: {
        tenantId,
        ...(filters?.appId && { appId: filters.appId }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: {
        _count: {
          select: { executions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, tenantId },
      include: {
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async execute(tenantId: string, id: string, triggerData?: any) {
    const workflow = await this.findOne(tenantId, id);

    if (!workflow.isActive) {
      throw new Error('Workflow is not active');
    }

    // Create execution record
    const execution = await this.prisma.workflowExecution.create({
      data: {
        tenantId,
        workflowId: id,
        status: 'running',
        triggerData,
        startedAt: new Date(),
      },
    });

    // Execute workflow actions (simplified - would need actual action execution logic)
    try {
      // TODO: Implement actual workflow execution engine
      // This would parse actions and execute them based on trigger data
      
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          result: { message: 'Workflow executed successfully' },
        },
      });

      return execution;
    } catch (error) {
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          completedAt: new Date(),
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.workflow.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig,
        actions: data.actions,
        isActive: data.isActive,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.workflow.delete({ where: { id } });
    return { message: 'Workflow deleted successfully' };
  }
}
