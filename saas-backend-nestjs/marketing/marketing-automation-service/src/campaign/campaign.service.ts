import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.marketingCampaign.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        workflow: data.workflow || { nodes: [], edges: [] },
        segment: data.segment || {},
        settings: data.settings || {},
      },
      include: {
        _count: {
          select: { activities: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string }) {
    return this.prisma.marketingCampaign.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        _count: {
          select: { activities: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const campaign = await this.prisma.marketingCampaign.findFirst({
      where: { id, tenantId },
      include: {
        activities: {
          take: 10,
          orderBy: { enteredAt: 'desc' },
        },
        statistics: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        _count: {
          select: { activities: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        workflow: data.workflow,
        segment: data.segment,
        settings: data.settings,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
  }

  async activate(tenantId: string, id: string) {
    const campaign = await this.findOne(tenantId, id);
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: {
        status: 'active',
        startDate: campaign.startDate || new Date(),
      },
    });
  }

  async pause(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.marketingCampaign.update({
      where: { id },
      data: { status: 'paused' },
    });
  }

  async getStatistics(tenantId: string, id: string, startDate?: Date, endDate?: Date) {
    await this.findOne(tenantId, id);

    const where: any = { campaignId: id };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const stats = await this.prisma.campaignStatistic.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    // Calculate totals
    const totals = stats.reduce(
      (acc, stat) => ({
        contactsEntered: acc.contactsEntered + stat.contactsEntered,
        contactsExited: acc.contactsExited + stat.contactsExited,
        emailsSent: acc.emailsSent + stat.emailsSent,
        emailsOpened: acc.emailsOpened + stat.emailsOpened,
        emailsClicked: acc.emailsClicked + stat.emailsClicked,
        actionsTriggered: acc.actionsTriggered + stat.actionsTriggered,
        leadsCreated: acc.leadsCreated + stat.leadsCreated,
        opportunitiesCreated: acc.opportunitiesCreated + stat.opportunitiesCreated,
        revenue: acc.revenue + Number(stat.revenue),
      }),
      {
        contactsEntered: 0,
        contactsExited: 0,
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        actionsTriggered: 0,
        leadsCreated: 0,
        opportunitiesCreated: 0,
        revenue: 0,
      },
    );

    return {
      daily: stats,
      totals,
      openRate: totals.emailsSent > 0 ? (totals.emailsOpened / totals.emailsSent) * 100 : 0,
      clickRate: totals.emailsSent > 0 ? (totals.emailsClicked / totals.emailsSent) * 100 : 0,
    };
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.marketingCampaign.delete({ where: { id } });
    return { message: 'Campaign deleted successfully' };
  }
}
