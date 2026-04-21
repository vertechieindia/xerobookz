import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStockLevel(tenantId: string, productId: string, warehouseId: string, locationId?: string) {
    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        tenantId,
        productId,
        warehouseId,
        ...(locationId && { locationId }),
      },
      include: {
        product: true,
        warehouse: true,
        location: true,
      },
    });

    if (!stockLevel) {
      // Return zero stock if not found
      return {
        productId,
        warehouseId,
        locationId,
        quantity: 0,
        reservedQty: 0,
        availableQty: 0,
        incomingQty: 0,
        outgoingQty: 0,
      };
    }

    return stockLevel;
  }

  async getAllStockLevels(tenantId: string, filters?: { warehouseId?: string; productId?: string }) {
    return this.prisma.stockLevel.findMany({
      where: {
        tenantId,
        ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
        ...(filters?.productId && { productId: filters.productId }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createStockMovement(tenantId: string, data: {
    productId: string;
    variantId?: string;
    warehouseId: string;
    locationId?: string;
    type: string;
    quantity: number;
    unitCost?: number;
    reference?: string;
    serialNumber?: string;
    lotNumber?: string;
    expiryDate?: Date;
    notes?: string;
  }) {
    // Create movement
    const movement = await this.prisma.stockMovement.create({
      data: {
        tenantId,
        ...data,
        quantity: data.quantity,
      },
    });

    // Update stock level
    await this.updateStockLevel(
      tenantId,
      data.productId,
      data.variantId,
      data.warehouseId,
      data.locationId,
      data.type,
      data.quantity,
    );

    return movement;
  }

  private async updateStockLevel(
    tenantId: string,
    productId: string,
    variantId: string | undefined,
    warehouseId: string,
    locationId: string | undefined,
    type: string,
    quantity: number,
  ) {
    // Find or create stock level
    let stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        tenantId,
        productId,
        variantId: variantId || null,
        warehouseId,
        locationId: locationId || null,
      },
    });

    if (!stockLevel) {
      stockLevel = await this.prisma.stockLevel.create({
        data: {
          tenantId,
          productId,
          variantId: variantId || null,
          warehouseId,
          locationId: locationId || null,
          quantity: 0,
          reservedQty: 0,
          availableQty: 0,
          incomingQty: 0,
          outgoingQty: 0,
        },
      });
    }

    // Update quantities based on movement type
    const updates: any = {};

    switch (type) {
      case 'receipt':
      case 'production':
        updates.quantity = { increment: quantity };
        updates.incomingQty = { decrement: quantity };
        break;
      case 'delivery':
      case 'scrap':
        if (stockLevel.quantity < quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        updates.quantity = { decrement: quantity };
        updates.outgoingQty = { decrement: quantity };
        break;
      case 'internal':
        // Internal transfer - handled separately
        break;
      case 'adjustment':
        updates.quantity = quantity;
        break;
    }

    // Recalculate available quantity
    if (updates.quantity) {
      const newQty = type === 'adjustment'
        ? quantity
        : stockLevel.quantity + (updates.quantity.increment || -updates.quantity.decrement);

      updates.availableQty = newQty - stockLevel.reservedQty;
    }

    await this.prisma.stockLevel.update({
      where: { id: stockLevel.id },
      data: updates,
    });
  }

  async reserveStock(tenantId: string, productId: string, warehouseId: string, quantity: number) {
    const stockLevel = await this.getStockLevel(tenantId, productId, warehouseId);

    if (stockLevel.availableQty < quantity) {
      throw new BadRequestException('Insufficient available stock');
    }

    await this.prisma.stockLevel.updateMany({
      where: {
        tenantId,
        productId,
        warehouseId,
      },
      data: {
        reservedQty: { increment: quantity },
        availableQty: { decrement: quantity },
      },
    });
  }

  async releaseReservation(tenantId: string, productId: string, warehouseId: string, quantity: number) {
    await this.prisma.stockLevel.updateMany({
      where: {
        tenantId,
        productId,
        warehouseId,
      },
      data: {
        reservedQty: { decrement: quantity },
        availableQty: { increment: quantity },
      },
    });
  }

  async getStockMovements(tenantId: string, filters?: {
    productId?: string;
    warehouseId?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.stockMovement.findMany({
      where: {
        tenantId,
        ...(filters?.productId && { productId: filters.productId }),
        ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.startDate && filters?.endDate && {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
