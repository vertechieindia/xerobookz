import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.customApp.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        icon: data.icon,
        menuItems: data.menuItems || [],
        createdBy: data.createdBy,
      },
      include: {
        _count: {
          select: { models: true, workflows: true, businessRules: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { isActive?: boolean }) {
    return this.prisma.customApp.findMany({
      where: {
        tenantId,
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: {
        _count: {
          select: { models: true, workflows: true, businessRules: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const app = await this.prisma.customApp.findFirst({
      where: { id, tenantId },
      include: {
        models: {
          include: {
            _count: {
              select: { fields: true, views: true, records: true },
            },
          },
        },
        workflows: {
          where: { isActive: true },
        },
        businessRules: {
          where: { isActive: true },
        },
      },
    });

    if (!app) {
      throw new NotFoundException('Custom app not found');
    }

    return app;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.customApp.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        menuItems: data.menuItems,
        isActive: data.isActive,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.customApp.delete({ where: { id } });
    return { message: 'Custom app deleted successfully' };
  }
}
