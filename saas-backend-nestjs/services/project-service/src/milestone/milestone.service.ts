import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class MilestoneService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, projectId: string, data: any) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.milestone.create({
      data: {
        tenantId,
        projectId,
        name: data.name,
        description: data.description,
        targetDate: data.targetDate,
      },
    });
  }

  async findAll(tenantId: string, projectId: string) {
    return this.prisma.milestone.findMany({
      where: { tenantId, projectId },
      orderBy: { targetDate: 'asc' },
    });
  }

  async findOne(tenantId: string, projectId: string, id: string) {
    const milestone = await this.prisma.milestone.findFirst({
      where: { id, projectId, tenantId },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    return milestone;
  }

  async markAchieved(tenantId: string, projectId: string, id: string) {
    await this.findOne(tenantId, projectId, id);
    return this.prisma.milestone.update({
      where: { id },
      data: {
        status: 'achieved',
        achievedDate: new Date(),
      },
    });
  }

  async update(tenantId: string, projectId: string, id: string, data: any) {
    await this.findOne(tenantId, projectId, id);
    return this.prisma.milestone.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, projectId: string, id: string) {
    await this.findOne(tenantId, projectId, id);
    await this.prisma.milestone.delete({ where: { id } });
    return { message: 'Milestone deleted successfully' };
  }
}
