import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Check code uniqueness
    const existing = await this.prisma.warehouse.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ConflictException('Warehouse with this code already exists');
    }

    return this.prisma.warehouse.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        locations: true,
        _count: {
          select: { stockLevels: true },
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.warehouse.findMany({
      where: { tenantId },
      include: {
        locations: {
          where: { isActive: true },
        },
        _count: {
          select: { stockLevels: true, pickingOrders: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { id, tenantId },
      include: {
        locations: true,
        stockLevels: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);

    if (data.code) {
      const existing = await this.prisma.warehouse.findFirst({
        where: { code: data.code, id: { not: id } },
      });

      if (existing) {
        throw new ConflictException('Warehouse with this code already exists');
      }
    }

    return this.prisma.warehouse.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.warehouse.delete({ where: { id } });
    return { message: 'Warehouse deleted successfully' };
  }

  async createLocation(tenantId: string, warehouseId: string, data: any) {
    await this.findOne(tenantId, warehouseId);

    if (data.barcode) {
      const existing = await this.prisma.location.findUnique({
        where: { barcode: data.barcode },
      });

      if (existing) {
        throw new ConflictException('Location with this barcode already exists');
      }
    }

    return this.prisma.location.create({
      data: {
        tenantId,
        warehouseId,
        ...data,
      },
    });
  }

  async getLocations(tenantId: string, warehouseId: string) {
    return this.prisma.location.findMany({
      where: { tenantId, warehouseId },
      orderBy: { name: 'asc' },
    });
  }
}
