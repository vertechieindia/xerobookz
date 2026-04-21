import { Injectable } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(tenantId: string, data: {
    recipientPhone: string;
    recipientName?: string;
    message: string;
    campaignId?: string;
  }) {
    // Shorten link if present in message
    const shortenedMessage = this.shortenLinks(data.message);

    return this.prisma.sMSMessage.create({
      data: {
        tenantId,
        campaignId: data.campaignId,
        recipientPhone: data.recipientPhone,
        recipientName: data.recipientName,
        message: shortenedMessage.message,
        linkUrl: shortenedMessage.linkUrl,
        cost: this.calculateCost(data.recipientPhone), // Based on country
      },
    });
  }

  async trackClick(tenantId: string, messageId: string) {
    const message = await this.prisma.sMSMessage.findFirst({
      where: { id: messageId, tenantId },
    });

    if (!message || message.clickedAt) {
      return { success: true };
    }

    await this.prisma.sMSMessage.update({
      where: { id: messageId },
      data: {
        status: 'clicked',
        clickedAt: new Date(),
      },
    });

    return { success: true };
  }

  private shortenLinks(message: string): { message: string; linkUrl?: string } {
    // Simple link shortening (in production, use a URL shortener service)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = message.match(urlRegex);
    
    if (matches && matches.length > 0) {
      // In production, shorten the URL
      return { message, linkUrl: matches[0] };
    }

    return { message };
  }

  private calculateCost(phoneNumber: string): number {
    // Simple cost calculation based on country code
    // In production, use actual SMS provider pricing
    if (phoneNumber.startsWith('+1')) return 0.0333; // US
    if (phoneNumber.startsWith('+44')) return 0.05; // UK
    return 0.04; // Default
  }
}
