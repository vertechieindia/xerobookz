import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class PipelineService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: { name: string; stages: any[] }) {
    return this.prisma.pipeline.create({
      data: {
        tenantId,
        name: data.name,
        stages: data.stages,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.pipeline.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, tenantId },
    });

    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    return pipeline;
  }

  async getDefault(tenantId: string) {
    // Return default pipeline stages
    return {
      stages: [
        { id: 'new', name: 'New', order: 1 },
        { id: 'qualified', name: 'Qualified', order: 2 },
        { id: 'proposal', name: 'Proposal', order: 3 },
        { id: 'negotiation', name: 'Negotiation', order: 4 },
        { id: 'won', name: 'Won', order: 5 },
        { id: 'lost', name: 'Lost', order: 6 },
      ],
    };
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.pipeline.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.pipeline.delete({ where: { id } });
    return { message: 'Pipeline deleted successfully' };
  }
}
