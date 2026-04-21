import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.activity.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { type?: string; status?: string; leadId?: string; opportunityId?: string }) {
    return this.prisma.activity.findMany({
      where: {
        tenantId,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.leadId && { leadId: filters.leadId }),
        ...(filters?.opportunityId && { opportunityId: filters.opportunityId }),
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, tenantId },
      include: {
        lead: true,
        opportunity: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    
    const updateData: any = { ...data };
    if (data.status === 'completed' && !data.completedAt) {
      updateData.completedAt = new Date();
    }

    return this.prisma.activity.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.activity.delete({ where: { id } });
    return { message: 'Activity deleted successfully' };
  }
}
