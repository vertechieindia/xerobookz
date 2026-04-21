import { Injectable } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.notification.create({
      data: {
        tenantId,
        userId: data.userId,
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link,
      },
    });
  }

  async findAll(tenantId: string, userId: string, filters?: { isRead?: boolean }) {
    return this.prisma.notification.findMany({
      where: {
        tenantId,
        userId,
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async markAsRead(tenantId: string, id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(tenantId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        tenantId,
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(tenantId: string, userId: string) {
    return this.prisma.notification.count({
      where: {
        tenantId,
        userId,
        isRead: false,
      },
    });
  }
}
