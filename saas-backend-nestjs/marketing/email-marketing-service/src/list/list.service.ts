import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.mailingList.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.mailingList.findMany({
      where: { tenantId, isActive: true },
      include: {
        _count: {
          select: { subscribers: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const list = await this.prisma.mailingList.findFirst({
      where: { id, tenantId },
      include: {
        subscribers: {
          where: { status: 'subscribed' },
          take: 100,
          orderBy: { subscribedAt: 'desc' },
        },
        _count: {
          select: { subscribers: true },
        },
      },
    });

    if (!list) {
      throw new NotFoundException('Mailing list not found');
    }

    return list;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.mailingList.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
    });
  }

  async addSubscriber(tenantId: string, listId: string, data: any) {
    await this.findOne(tenantId, listId);

    const existing = await this.prisma.mailingListSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: data.email,
        },
      },
    });

    if (existing) {
      if (existing.status === 'subscribed') {
        throw new ConflictException('Email already subscribed');
      }
      // Resubscribe
      return this.prisma.mailingListSubscriber.update({
        where: { id: existing.id },
        data: {
          status: 'subscribed',
          subscribedAt: new Date(),
          unsubscribedAt: null,
          name: data.name,
          metadata: data.metadata,
        },
      });
    }

    const subscriber = await this.prisma.mailingListSubscriber.create({
      data: {
        tenantId,
        listId,
        email: data.email,
        name: data.name,
        metadata: data.metadata,
      },
    });

    // Update subscriber count
    await this.prisma.mailingList.update({
      where: { id: listId },
      data: {
        subscriberCount: { increment: 1 },
      },
    });

    return subscriber;
  }

  async unsubscribe(tenantId: string, listId: string, email: string) {
    const subscriber = await this.prisma.mailingListSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email,
        },
      },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    if (subscriber.status === 'unsubscribed') {
      return subscriber;
    }

    const updated = await this.prisma.mailingListSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
    });

    // Update subscriber count
    await this.prisma.mailingList.update({
      where: { id: listId },
      data: {
        subscriberCount: { decrement: 1 },
      },
    });

    return updated;
  }

  async getSubscribers(tenantId: string, listId: string, filters?: { status?: string }) {
    return this.prisma.mailingListSubscriber.findMany({
      where: {
        tenantId,
        listId,
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { subscribedAt: 'desc' },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.mailingList.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Mailing list deactivated successfully' };
  }
}
