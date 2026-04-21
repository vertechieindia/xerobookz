import { Injectable } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  async trackOpen(tenantId: string, emailId: string) {
    const email = await this.prisma.email.findFirst({
      where: { id: emailId, tenantId },
    });

    if (!email || email.openedAt) {
      return { success: true };
    }

    await this.prisma.email.update({
      where: { id: emailId },
      data: {
        status: 'opened',
        openedAt: new Date(),
      },
    });

    return { success: true };
  }

  async trackClick(tenantId: string, emailId: string, linkUrl: string, metadata?: any) {
    const email = await this.prisma.email.findFirst({
      where: { id: emailId, tenantId },
    });

    if (!email) {
      return { success: false };
    }

    // Record click
    await this.prisma.emailClick.create({
      data: {
        tenantId,
        emailId,
        linkUrl,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    // Update email status if not already clicked
    if (!email.clickedAt) {
      await this.prisma.email.update({
        where: { id: emailId },
        data: {
          status: 'clicked',
          clickedAt: new Date(),
        },
      });
    }

    return { success: true };
  }

  async getEmailStats(tenantId: string, emailId: string) {
    const email = await this.prisma.email.findFirst({
      where: { id: emailId, tenantId },
      include: {
        clicks: {
          orderBy: { clickedAt: 'desc' },
        },
      },
    });

    if (!email) {
      throw new Error('Email not found');
    }

    return {
      email,
      clickCount: email.clicks.length,
      uniqueClicks: new Set(email.clicks.map((c) => c.linkUrl)).size,
    };
  }
}
