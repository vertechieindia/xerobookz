import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.vOIPCall.create({
      data: {
        tenantId,
        callerId: data.callerId,
        receiverId: data.receiverId,
        phoneNumber: data.phoneNumber,
        direction: data.direction || 'outbound',
        linkedToType: data.linkedToType,
        linkedToId: data.linkedToId,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    userId?: string;
    direction?: string;
    status?: string;
    linkedToType?: string;
    linkedToId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.vOIPCall.findMany({
      where: {
        tenantId,
        ...(filters?.userId && {
          OR: [{ callerId: filters.userId }, { receiverId: filters.userId }],
        }),
        ...(filters?.direction && { direction: filters.direction }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.linkedToType && { linkedToType: filters.linkedToType }),
        ...(filters?.linkedToId && { linkedToId: filters.linkedToId }),
        ...(filters?.startDate && filters?.endDate && {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findOne(tenantId: string, id: string) {
    const call = await this.prisma.vOIPCall.findFirst({
      where: { id, tenantId },
    });

    if (!call) {
      throw new NotFoundException('VoIP Call not found');
    }

    return call;
  }

  async answer(tenantId: string, id: string) {
    const call = await this.findOne(tenantId, id);
    return this.prisma.vOIPCall.update({
      where: { id },
      data: {
        status: 'answered',
        answeredAt: new Date(),
        startedAt: call.startedAt || new Date(),
      },
    });
  }

  async end(tenantId: string, id: string, notes?: string) {
    const call = await this.findOne(tenantId, id);
    const duration = call.startedAt
      ? Math.floor((new Date().getTime() - call.startedAt.getTime()) / 1000)
      : null;

    return this.prisma.vOIPCall.update({
      where: { id },
      data: {
        status: 'ended',
        endedAt: new Date(),
        duration,
        notes,
      },
    });
  }

  async linkToRecord(tenantId: string, id: string, linkedToType: string, linkedToId: string) {
    await this.findOne(tenantId, id);
    return this.prisma.vOIPCall.update({
      where: { id },
      data: {
        linkedToType,
        linkedToId,
      },
    });
  }
}
