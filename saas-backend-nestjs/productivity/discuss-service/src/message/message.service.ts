import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    const message = await this.prisma.message.create({
      data: {
        tenantId,
        channelId: data.channelId,
        senderId: data.senderId,
        content: data.content,
        messageType: data.messageType || 'text',
        fileUrl: data.fileUrl,
        replyToId: data.replyToId,
      },
      include: {
        reactions: true,
      },
    });

    return message;
  }

  async findAll(tenantId: string, channelId: string, filters?: {
    limit?: number;
    before?: Date;
  }) {
    return this.prisma.message.findMany({
      where: {
        tenantId,
        channelId,
        isDeleted: false,
        ...(filters?.before && { createdAt: { lt: filters.before } }),
      },
      include: {
        reactions: true,
        _count: {
          select: { readReceipts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  async findOne(tenantId: string, id: string) {
    const message = await this.prisma.message.findFirst({
      where: { id, tenantId },
      include: {
        reactions: true,
        readReceipts: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async update(tenantId: string, id: string, content: string) {
    await this.findOne(tenantId, id);
    return this.prisma.message.update({
      where: { id },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.message.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async addReaction(tenantId: string, messageId: string, data: any) {
    await this.findOne(tenantId, messageId);
    return this.prisma.messageReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: data.userId,
          emoji: data.emoji,
        },
      },
      update: {},
      create: {
        tenantId,
        messageId,
        userId: data.userId,
        emoji: data.emoji,
      },
    });
  }

  async markAsRead(tenantId: string, messageId: string, userId: string) {
    await this.findOne(tenantId, messageId);
    return this.prisma.messageReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        tenantId,
        messageId,
        userId,
      },
    });
  }
}
