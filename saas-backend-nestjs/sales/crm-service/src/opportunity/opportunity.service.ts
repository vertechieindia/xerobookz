import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class OpportunityService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.opportunity.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        lead: true,
        contact: true,
        quotations: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { stage?: string; assignedToId?: string }) {
    return this.prisma.opportunity.findMany({
      where: {
        tenantId,
        ...(filters?.stage && { stage: filters.stage }),
        ...(filters?.assignedToId && { assignedToId: filters.assignedToId }),
      },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { activities: true, quotations: true },
        },
      },
      orderBy: { expectedCloseDate: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, tenantId },
      include: {
        lead: true,
        contact: true,
        quotations: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return opportunity;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.opportunity.update({
      where: { id },
      data,
      include: {
        lead: true,
        contact: true,
      },
    });
  }

  async updateStage(tenantId: string, id: string, stage: string) {
    await this.findOne(tenantId, id);
    
    const updateData: any = { stage };
    
    if (stage === 'won' || stage === 'lost') {
      updateData.actualCloseDate = new Date();
    }

    return this.prisma.opportunity.update({
      where: { id },
      data: updateData,
    });
  }

  async getPipeline(tenantId: string) {
    const opportunities = await this.findAll(tenantId);
    
    // Group by stage
    const pipeline: Record<string, any[]> = {};
    opportunities.forEach((opp) => {
      if (!pipeline[opp.stage]) {
        pipeline[opp.stage] = [];
      }
      pipeline[opp.stage].push(opp);
    });

    // Calculate totals
    const totals: Record<string, number> = {};
    Object.keys(pipeline).forEach((stage) => {
      totals[stage] = pipeline[stage].reduce(
        (sum, opp) => sum + Number(opp.expectedRevenue) * (opp.probability / 100),
        0,
      );
    });

    return {
      stages: pipeline,
      totals,
      totalRevenue: Object.values(totals).reduce((a, b) => a + b, 0),
    };
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.opportunity.delete({ where: { id } });
    return { message: 'Opportunity deleted successfully' };
  }
}
