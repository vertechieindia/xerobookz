import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.sMSCampaign.create({
      data: {
        tenantId,
        name: data.name,
        message: data.message,
        segment: data.segment || {},
        settings: data.settings || {},
        scheduledAt: data.scheduledAt,
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string }) {
    return this.prisma.sMSCampaign.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const campaign = await this.prisma.sMSCampaign.findFirst({
      where: { id, tenantId },
      include: {
        statistics: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        _count: {
          select: { messages: true },
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
    return this.prisma.sMSCampaign.update({
      where: { id },
      data: {
        name: data.name,
        message: data.message,
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

    // Update status
    await this.prisma.sMSCampaign.update({
      where: { id },
      data: { status: 'sending', sentAt: new Date() },
    });

    // In production, this would queue SMS messages for sending
    await this.prisma.sMSCampaign.update({
      where: { id },
      data: { status: 'sent' },
    });

    return { message: 'Campaign sent successfully' };
  }

  async getStatistics(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    const stats = await this.prisma.sMSCampaignStatistic.findMany({
      where: { campaignId: id },
      orderBy: { date: 'asc' },
    });

    const totals = stats.reduce(
      (acc, stat) => ({
        messagesSent: acc.messagesSent + stat.messagesSent,
        messagesDelivered: acc.messagesDelivered + stat.messagesDelivered,
        messagesClicked: acc.messagesClicked + stat.messagesClicked,
        messagesFailed: acc.messagesFailed + stat.messagesFailed,
        totalCost: acc.totalCost + Number(stat.totalCost),
        leadsCreated: acc.leadsCreated + stat.leadsCreated,
        revenue: acc.revenue + Number(stat.revenue),
      }),
      {
        messagesSent: 0,
        messagesDelivered: 0,
        messagesClicked: 0,
        messagesFailed: 0,
        totalCost: 0,
        leadsCreated: 0,
        revenue: 0,
      },
    );

    return {
      daily: stats,
      totals,
      deliveryRate: totals.messagesSent > 0 ? (totals.messagesDelivered / totals.messagesSent) * 100 : 0,
      clickRate: totals.messagesDelivered > 0 ? (totals.messagesClicked / totals.messagesDelivered) * 100 : 0,
    };
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.sMSCampaign.delete({ where: { id } });
    return { message: 'Campaign deleted successfully' };
  }
}
