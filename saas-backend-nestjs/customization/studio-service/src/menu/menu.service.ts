import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.menuItem.create({
      data: {
        tenantId,
        appId: data.appId,
        parentId: data.parentId,
        name: data.name,
        label: data.label,
        icon: data.icon,
        action: data.action,
        sequence: data.sequence || 0,
      },
    });
  }

  async findAll(tenantId: string, filters?: { appId?: string; parentId?: string }) {
    return this.prisma.menuItem.findMany({
      where: {
        tenantId,
        ...(filters?.appId && { appId: filters.appId }),
        ...(filters?.parentId !== undefined && { parentId: filters.parentId }),
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sequence: 'asc' },
        },
      },
      orderBy: { sequence: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: { id, tenantId },
      include: {
        parent: true,
        children: {
          orderBy: { sequence: 'asc' },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name,
        label: data.label,
        icon: data.icon,
        action: data.action,
        sequence: data.sequence,
        isActive: data.isActive,
      },
    });
  }

  async reorder(tenantId: string, items: Array<{ id: string; sequence: number }>) {
    await Promise.all(
      items.map((item) =>
        this.prisma.menuItem.updateMany({
          where: { id: item.id, tenantId },
          data: { sequence: item.sequence },
        }),
      ),
    );

    return { message: 'Menu items reordered successfully' };
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.menuItem.delete({ where: { id } });
    return { message: 'Menu item deleted successfully' };
  }
}
