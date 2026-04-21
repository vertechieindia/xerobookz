import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  async createRule(tenantId: string, data: any) {
    return this.prisma.automationRule.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConditions: data.triggerConditions || {},
        actions: data.actions || [],
      },
    });
  }

  async findAllRules(tenantId: string, filters?: { isActive?: boolean }) {
    return this.prisma.automationRule.findMany({
      where: {
        tenantId,
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const rule = await this.prisma.automationRule.findFirst({
      where: { id, tenantId },
    });

    if (!rule) {
      throw new NotFoundException('Automation rule not found');
    }

    return rule;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.automationRule.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConditions: data.triggerConditions,
        actions: data.actions,
        isActive: data.isActive,
      },
    });
  }

  async toggle(tenantId: string, id: string) {
    const rule = await this.findOne(tenantId, id);
    return this.prisma.automationRule.update({
      where: { id },
      data: { isActive: !rule.isActive },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.automationRule.delete({ where: { id } });
    return { message: 'Automation rule deleted successfully' };
  }

  async evaluateRule(tenantId: string, ruleId: string, eventData: any) {
    const rule = await this.findOne(tenantId, ruleId);

    if (!rule.isActive) {
      return { shouldTrigger: false, reason: 'Rule is inactive' };
    }

    // Check trigger conditions
    const shouldTrigger = this.checkConditions(rule.triggerConditions, eventData);

    if (shouldTrigger) {
      // Execute actions
      await this.executeActions(tenantId, rule.actions, eventData);
    }

    return { shouldTrigger, ruleId: rule.id };
  }

  private checkConditions(conditions: any, eventData: any): boolean {
    // Simple condition checking logic
    // In production, this would be more sophisticated
    if (!conditions || Object.keys(conditions).length === 0) {
      return true;
    }

    // Check each condition
    for (const [key, value] of Object.entries(conditions)) {
      if (eventData[key] !== value) {
        return false;
      }
    }

    return true;
  }

  private async executeActions(tenantId: string, actions: any[], eventData: any) {
    for (const action of actions) {
      switch (action.type) {
        case 'send_email':
          // Trigger email sending
          break;
        case 'update_lead':
          // Update lead in CRM
          break;
        case 'assign_to_team':
          // Assign to sales team
          break;
        case 'create_opportunity':
          // Create opportunity
          break;
        default:
          // Unknown action type
          break;
      }
    }
  }
}
