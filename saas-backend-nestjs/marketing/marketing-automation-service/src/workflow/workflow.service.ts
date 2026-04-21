import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async addContactToCampaign(
    tenantId: string,
    campaignId: string,
    contactId: string,
    contactType: string,
  ) {
    // Verify campaign exists
    const campaign = await this.prisma.marketingCampaign.findFirst({
      where: { id: campaignId, tenantId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== 'active') {
      throw new Error('Campaign is not active');
    }

    // Check if contact already in campaign
    const existing = await this.prisma.campaignActivity.findFirst({
      where: {
        tenantId,
        campaignId,
        contactId,
        status: 'active',
      },
    });

    if (existing) {
      return existing;
    }

    // Create activity and enter workflow
    const activity = await this.prisma.campaignActivity.create({
      data: {
        tenantId,
        campaignId,
        contactId,
        contactType,
        status: 'active',
        enteredAt: new Date(),
        currentNode: this.getStartNode(campaign.workflow),
      },
    });

    // Process initial workflow step
    await this.processWorkflowStep(tenantId, campaignId, activity.id, activity.currentNode);

    return activity;
  }

  async processEvent(
    tenantId: string,
    activityId: string,
    eventType: string,
    eventData: any,
  ) {
    const activity = await this.prisma.campaignActivity.findFirst({
      where: { id: activityId, tenantId },
      include: { campaign: true },
    });

    if (!activity || activity.status !== 'active') {
      throw new NotFoundException('Activity not found or not active');
    }

    // Record event
    await this.prisma.campaignEvent.create({
      data: {
        tenantId,
        activityId,
        eventType,
        nodeId: activity.currentNode,
        actionData: eventData,
      },
    });

    // Process workflow based on event
    if (activity.currentNode) {
      await this.processWorkflowStep(
        tenantId,
        activity.campaignId,
        activityId,
        activity.currentNode,
        eventType,
      );
    }

    return { success: true };
  }

  private async processWorkflowStep(
    tenantId: string,
    campaignId: string,
    activityId: string,
    nodeId: string | null,
    triggerEvent?: string,
  ) {
    if (!nodeId) return;

    const activity = await this.prisma.campaignActivity.findUnique({
      where: { id: activityId },
      include: { campaign: true },
    });

    if (!activity) return;

    const workflow = activity.campaign.workflow as any;
    const node = workflow.nodes?.find((n: any) => n.id === nodeId);

    if (!node) return;

    // Execute node actions
    if (node.actions) {
      for (const action of node.actions) {
        await this.executeAction(tenantId, campaignId, activityId, action, activity.contactId);
      }
    }

    // Move to next node based on conditions
    const nextNode = this.getNextNode(workflow, nodeId, triggerEvent);
    if (nextNode) {
      await this.prisma.campaignActivity.update({
        where: { id: activityId },
        data: { currentNode: nextNode },
      });

      // Process next step
      await this.processWorkflowStep(tenantId, campaignId, activityId, nextNode);
    } else {
      // Workflow completed
      await this.prisma.campaignActivity.update({
        where: { id: activityId },
        data: { status: 'completed', exitedAt: new Date() },
      });
    }
  }

  private async executeAction(
    tenantId: string,
    campaignId: string,
    activityId: string,
    action: any,
    contactId: string,
  ) {
    switch (action.type) {
      case 'send_email':
        // Trigger email sending (would integrate with email service)
        await this.recordEvent(tenantId, activityId, 'email_sent', { action });
        break;
      case 'update_lead':
        // Update lead in CRM (would integrate with CRM service)
        await this.recordEvent(tenantId, activityId, 'lead_updated', { action });
        break;
      case 'assign_to_team':
        // Assign to sales team
        await this.recordEvent(tenantId, activityId, 'assigned_to_team', { action });
        break;
      case 'create_opportunity':
        // Create opportunity
        await this.recordEvent(tenantId, activityId, 'opportunity_created', { action });
        break;
      default:
        await this.recordEvent(tenantId, activityId, 'action_triggered', { action });
    }
  }

  private async recordEvent(
    tenantId: string,
    activityId: string,
    eventType: string,
    data: any,
  ) {
    await this.prisma.campaignEvent.create({
      data: {
        tenantId,
        activityId,
        eventType,
        actionData: data,
      },
    });
  }

  private getStartNode(workflow: any): string | null {
    if (!workflow.nodes || workflow.nodes.length === 0) return null;
    return workflow.nodes[0]?.id || null;
  }

  private getNextNode(workflow: any, currentNodeId: string, triggerEvent?: string): string | null {
    const edges = workflow.edges || [];
    const edge = edges.find(
      (e: any) => e.source === currentNodeId && (!e.condition || e.condition === triggerEvent),
    );
    return edge?.target || null;
  }

  async getActivityStatus(tenantId: string, activityId: string) {
    const activity = await this.prisma.campaignActivity.findFirst({
      where: { id: activityId, tenantId },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            workflow: true,
          },
        },
        events: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }
}
