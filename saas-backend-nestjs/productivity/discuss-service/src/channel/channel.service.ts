import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    const channel = await this.prisma.channel.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        type: data.type || 'public',
        createdBy: data.createdBy,
      },
    });

    // Add creator as member
    await this.prisma.channelMember.create({
      data: {
        tenantId,
        channelId: channel.id,
        userId: data.createdBy,
        role: 'owner',
      },
    });

    return channel;
  }

  async findAll(tenantId: string, userId: string) {
    // Get channels user is member of
    const memberChannels = await this.prisma.channelMember.findMany({
      where: { tenantId, userId },
      include: {
        channel: {
          include: {
            _count: {
              select: { members: true, messages: true },
            },
          },
        },
      },
    });

    return memberChannels.map((mc) => ({
      ...mc.channel,
      role: mc.role,
      isMuted: mc.isMuted,
      lastReadAt: mc.lastReadAt,
    }));
  }

  async findOne(tenantId: string, id: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id, tenantId },
      include: {
        members: {
          take: 50,
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async addMember(tenantId: string, channelId: string, data: any) {
    await this.findOne(tenantId, channelId);
    return this.prisma.channelMember.create({
      data: {
        tenantId,
        channelId,
        userId: data.userId,
        role: data.role || 'member',
      },
    });
  }

  async removeMember(tenantId: string, channelId: string, userId: string) {
    await this.findOne(tenantId, channelId);
    await this.prisma.channelMember.deleteMany({
      where: { channelId, userId, tenantId },
    });
    return { message: 'Member removed successfully' };
  }

  async archive(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.channel.update({
      where: { id },
      data: { isArchived: true },
    });
  }
}
