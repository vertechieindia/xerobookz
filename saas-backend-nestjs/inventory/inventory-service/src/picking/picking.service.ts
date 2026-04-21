import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class PickingService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.pickingOrder.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        warehouse: true,
      },
    });
  }

  async findAll(tenantId: string, filters?: { warehouseId?: string; status?: string }) {
    return this.prisma.pickingOrder.findMany({
      where: {
        tenantId,
        ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const picking = await this.prisma.pickingOrder.findFirst({
      where: { id, tenantId },
      include: {
        warehouse: true,
      },
    });

    if (!picking) {
      throw new NotFoundException('Picking order not found');
    }

    return picking;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    await this.findOne(tenantId, id);

    const updateData: any = { status };

    if (status === 'in_progress' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }

    if (status === 'done') {
      updateData.completedAt = new Date();
    }

    return this.prisma.pickingOrder.update({
      where: { id },
      data: updateData,
    });
  }

  async assign(tenantId: string, id: string, assignedToId: string) {
    await this.findOne(tenantId, id);
    return this.prisma.pickingOrder.update({
      where: { id },
      data: { assignedToId, status: 'assigned' },
    });
  }
}
