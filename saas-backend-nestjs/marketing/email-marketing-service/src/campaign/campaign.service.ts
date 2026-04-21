import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.emailCampaign.create({
      data: {
        tenantId,
        name: data.name,
        subject: data.subject,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        templateId: data.templateId,
        content: data.content || {},
        segment: data.segment || {},
        settings: data.settings || {},
      },
      include: {
        _count: {
          select: { emails: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string }) {
    return this.prisma.emailCampaign.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        _count: {
          select: { emails: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const campaign = await this.prisma.emailCampaign.findFirst({
      where: { id, tenantId },
      include: {
        statistics: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        _count: {
          select: { emails: true },
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
    return this.prisma.emailCampaign.update({
      where: { id },
      data: {
        name: data.name,
        subject: data.subject,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        templateId: data.templateId,
        content: data.content,
        segment: data.segment,
        settings: data.settings,
        status: data.status,
        scheduledAt: data.scheduledAt,
      },
    });
  }

  async send(tenantId: string, id: string) {
    const campaign = await this.findOne(tenantId, id);

    if (campaign.status === 'sent') {
      throw new Error('Campaign already sent');
    }

    // Update status to sending
    await this.prisma.emailCampaign.update({
      where: { id },
      data: { status: 'sending', sentAt: new Date() },
    });

    // In production, this would queue emails for sending
    // For now, we'll just mark it as sent
    await this.prisma.emailCampaign.update({
      where: { id },
      data: { status: 'sent' },
    });

    return { message: 'Campaign sent successfully' };
  }

  async getStatistics(tenantId: string, id: string, startDate?: Date, endDate?: Date) {
    await this.findOne(tenantId, id);

    const where: any = { campaignId: id };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const stats = await this.prisma.emailCampaignStatistic.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    // Calculate totals
    const totals = stats.reduce(
      (acc, stat) => ({
        emailsSent: acc.emailsSent + stat.emailsSent,
        emailsDelivered: acc.emailsDelivered + stat.emailsDelivered,
        emailsOpened: acc.emailsOpened + stat.emailsOpened,
        emailsClicked: acc.emailsClicked + stat.emailsClicked,
        emailsBounced: acc.emailsBounced + stat.emailsBounced,
        leadsCreated: acc.leadsCreated + stat.leadsCreated,
        opportunitiesCreated: acc.opportunitiesCreated + stat.opportunitiesCreated,
        revenue: acc.revenue + Number(stat.revenue),
      }),
      {
        emailsSent: 0,
        emailsDelivered: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        emailsBounced: 0,
        leadsCreated: 0,
        opportunitiesCreated: 0,
        revenue: 0,
      },
    );

    return {
      daily: stats,
      totals,
      openRate: totals.emailsDelivered > 0 ? (totals.emailsOpened / totals.emailsDelivered) * 100 : 0,
      clickRate: totals.emailsDelivered > 0 ? (totals.emailsClicked / totals.emailsDelivered) * 100 : 0,
      bounceRate: totals.emailsSent > 0 ? (totals.emailsBounced / totals.emailsSent) * 100 : 0,
    };
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.emailCampaign.delete({ where: { id } });
    return { message: 'Campaign deleted successfully' };
  }
}
