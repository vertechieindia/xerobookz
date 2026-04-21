import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class RuleService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.businessRule.create({
      data: {
        tenantId,
        appId: data.appId,
        name: data.name,
        description: data.description,
        model: data.model,
        condition: data.condition,
        action: data.action,
        priority: data.priority || 0,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    appId?: string;
    model?: string;
    isActive?: boolean;
  }) {
    return this.prisma.businessRule.findMany({
      where: {
        tenantId,
        ...(filters?.appId && { appId: filters.appId }),
        ...(filters?.model && { model: filters.model }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(tenantId: string, id: string) {
    const rule = await this.prisma.businessRule.findFirst({
      where: { id, tenantId },
    });

    if (!rule) {
      throw new NotFoundException('Business rule not found');
    }

    return rule;
  }

  async evaluate(tenantId: string, model: string, recordData: any) {
    // Get all active rules for the model
    const rules = await this.prisma.businessRule.findMany({
      where: {
        tenantId,
        model,
        isActive: true,
      },
      orderBy: { priority: 'desc' },
    });

    const results = [];

    for (const rule of rules) {
      // TODO: Implement actual condition evaluation
      // This would parse the condition JSON and evaluate it against recordData
      const conditionMet = true; // Placeholder

      if (conditionMet) {
        // TODO: Execute action
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          action: rule.action,
          executed: true,
        });
      }
    }

    return results;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.businessRule.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        condition: data.condition,
        action: data.action,
        priority: data.priority,
        isActive: data.isActive,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.businessRule.delete({ where: { id } });
    return { message: 'Business rule deleted successfully' };
  }
}
