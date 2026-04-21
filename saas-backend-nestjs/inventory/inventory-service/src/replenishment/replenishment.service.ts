import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ReplenishmentService {
  constructor(private prisma: PrismaService) {}

  async createRule(tenantId: string, data: any) {
    return this.prisma.replenishmentRule.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findAllRules(tenantId: string, filters?: { productId?: string; warehouseId?: string }) {
    return this.prisma.replenishmentRule.findMany({
      where: {
        tenantId,
        isActive: true,
        ...(filters?.productId && { productId: filters.productId }),
        ...(filters?.warehouseId && { warehouseId: filters.warehouseId }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  async checkReplenishment(tenantId: string, productId: string, warehouseId: string) {
    const rule = await this.prisma.replenishmentRule.findFirst({
      where: {
        tenantId,
        productId,
        warehouseId,
        isActive: true,
      },
    });

    if (!rule) {
      return { needsReplenishment: false };
    }

    const stockLevel = await this.prisma.stockLevel.findFirst({
      where: {
        tenantId,
        productId,
        warehouseId,
      },
    });

    if (!stockLevel) {
      return {
        needsReplenishment: true,
        suggestedQty: rule.maxQty,
        reason: 'No stock found',
      };
    }

    const currentQty = Number(stockLevel.quantity);

    if (currentQty <= Number(rule.minQty)) {
      const suggestedQty = Number(rule.maxQty) - currentQty;
      return {
        needsReplenishment: true,
        suggestedQty,
        reason: 'Below minimum quantity',
        currentQty,
        minQty: Number(rule.minQty),
        maxQty: Number(rule.maxQty),
      };
    }

    return { needsReplenishment: false, currentQty };
  }

  async getReplenishmentSuggestions(tenantId: string, warehouseId?: string) {
    const rules = await this.findAllRules(tenantId, { warehouseId });

    const suggestions = [];

    for (const rule of rules) {
      const check = await this.checkReplenishment(
        tenantId,
        rule.productId,
        rule.warehouseId,
      );

      if (check.needsReplenishment) {
        suggestions.push({
          productId: rule.productId,
          warehouseId: rule.warehouseId,
          ...check,
          ruleType: rule.ruleType,
        });
      }
    }

    return suggestions;
  }
}
