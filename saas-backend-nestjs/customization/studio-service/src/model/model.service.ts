import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Generate table name
    const tableName = `custom_${data.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    return this.prisma.customModel.create({
      data: {
        tenantId,
        appId: data.appId,
        name: data.name,
        label: data.label,
        description: data.description,
        tableName,
      },
      include: {
        _count: {
          select: { fields: true, views: true, records: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { appId?: string; isActive?: boolean }) {
    return this.prisma.customModel.findMany({
      where: {
        tenantId,
        ...(filters?.appId && { appId: filters.appId }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: {
        _count: {
          select: { fields: true, views: true, records: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const model = await this.prisma.customModel.findFirst({
      where: { id, tenantId },
      include: {
        fields: {
          orderBy: { displayOrder: 'asc' },
        },
        views: {
          where: { isActive: true },
        },
        _count: {
          select: { records: true },
        },
      },
    });

    if (!model) {
      throw new NotFoundException('Custom model not found');
    }

    return model;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.customModel.update({
      where: { id },
      data: {
        name: data.name,
        label: data.label,
        description: data.description,
        isActive: data.isActive,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.customModel.delete({ where: { id } });
    return { message: 'Custom model deleted successfully' };
  }
}
