import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async createVideoCall(tenantId: string, data: any) {
    return this.prisma.videoCall.create({
      data: {
        tenantId,
        channelId: data.channelId,
        initiatorId: data.initiatorId,
        title: data.title,
        participants: data.participants || [data.initiatorId],
      },
    });
  }

  async endVideoCall(tenantId: string, id: string) {
    const call = await this.prisma.videoCall.findFirst({
      where: { id, tenantId },
    });

    if (!call) {
      throw new NotFoundException('Video call not found');
    }

    return this.prisma.videoCall.update({
      where: { id },
      data: {
        status: 'ended',
        endedAt: new Date(),
      },
    });
  }

  async createVoiceCall(tenantId: string, data: any) {
    return this.prisma.voiceCall.create({
      data: {
        tenantId,
        callerId: data.callerId,
        receiverId: data.receiverId,
        status: 'ringing',
      },
    });
  }

  async answerVoiceCall(tenantId: string, id: string) {
    const call = await this.prisma.voiceCall.findFirst({
      where: { id, tenantId },
    });

    if (!call) {
      throw new NotFoundException('Voice call not found');
    }

    return this.prisma.voiceCall.update({
      where: { id },
      data: {
        status: 'answered',
        startedAt: new Date(),
      },
    });
  }

  async endVoiceCall(tenantId: string, id: string) {
    const call = await this.prisma.voiceCall.findFirst({
      where: { id, tenantId },
    });

    if (!call) {
      throw new NotFoundException('Voice call not found');
    }

    const duration = call.startedAt
      ? Math.floor((new Date().getTime() - call.startedAt.getTime()) / 1000)
      : null;

    return this.prisma.voiceCall.update({
      where: { id },
      data: {
        status: 'ended',
        endedAt: new Date(),
        duration,
      },
    });
  }

  async getCallHistory(tenantId: string, userId: string, type?: string) {
    if (type === 'video') {
      return this.prisma.videoCall.findMany({
        where: {
          tenantId,
          participants: { array_contains: [userId] },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    }

    return this.prisma.voiceCall.findMany({
      where: {
        tenantId,
        OR: [{ callerId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
