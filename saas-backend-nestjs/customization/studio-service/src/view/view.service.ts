import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ViewService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Verify model exists if modelId provided
    if (data.modelId) {
      const model = await this.prisma.customModel.findFirst({
        where: { id: data.modelId, tenantId },
      });

      if (!model) {
        throw new NotFoundException('Custom model not found');
      }
    }

    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await this.prisma.customView.updateMany({
        where: {
          tenantId,
          modelId: data.modelId,
          baseModel: data.baseModel,
          viewType: data.viewType,
        },
        data: { isDefault: false },
      });
    }

    return this.prisma.customView.create({
      data: {
        tenantId,
        modelId: data.modelId,
        baseModel: data.baseModel,
        viewType: data.viewType,
        name: data.name,
        isDefault: data.isDefault || false,
        viewConfig: data.viewConfig,
        filters: data.filters,
        groups: data.groups,
        sortBy: data.sortBy,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    modelId?: string;
    baseModel?: string;
    viewType?: string;
  }) {
    return this.prisma.customView.findMany({
      where: {
        tenantId,
        ...(filters?.modelId && { modelId: filters.modelId }),
        ...(filters?.baseModel && { baseModel: filters.baseModel }),
        ...(filters?.viewType && { viewType: filters.viewType }),
        isActive: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(tenantId: string, id: string) {
    const view = await this.prisma.customView.findFirst({
      where: { id, tenantId },
    });

    if (!view) {
      throw new NotFoundException('Custom view not found');
    }

    return view;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.customView.update({
      where: { id },
      data: {
        name: data.name,
        isDefault: data.isDefault,
        viewConfig: data.viewConfig,
        filters: data.filters,
        groups: data.groups,
        sortBy: data.sortBy,
        isActive: data.isActive,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.customView.delete({ where: { id } });
    return { message: 'Custom view deleted successfully' };
  }
}
