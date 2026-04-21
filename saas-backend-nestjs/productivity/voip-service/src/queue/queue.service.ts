import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService) {}

  async addToQueue(tenantId: string, data: any) {
    return this.prisma.callQueue.create({
      data: {
        tenantId,
        userId: data.userId,
        contactId: data.contactId,
        phoneNumber: data.phoneNumber,
        linkedToType: data.linkedToType,
        linkedToId: data.linkedToId,
        priority: data.priority || 0,
        scheduledAt: data.scheduledAt,
      },
    });
  }

  async getQueue(tenantId: string, userId: string) {
    return this.prisma.callQueue.findMany({
      where: {
        tenantId,
        userId,
        status: { in: ['pending', 'calling'] },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledAt: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async markAsCalling(tenantId: string, id: string) {
    const queueItem = await this.prisma.callQueue.findFirst({
      where: { id, tenantId },
    });

    if (!queueItem) {
      throw new NotFoundException('Queue item not found');
    }

    return this.prisma.callQueue.update({
      where: { id },
      data: { status: 'calling' },
    });
  }

  async complete(tenantId: string, id: string) {
    await this.markAsCalling(tenantId, id);
    return this.prisma.callQueue.update({
      where: { id },
      data: { status: 'completed' },
    });
  }

  async cancel(tenantId: string, id: string) {
    const queueItem = await this.prisma.callQueue.findFirst({
      where: { id, tenantId },
    });

    if (!queueItem) {
      throw new NotFoundException('Queue item not found');
    }

    return this.prisma.callQueue.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }
}
