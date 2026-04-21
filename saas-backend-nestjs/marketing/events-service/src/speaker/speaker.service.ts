import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SpeakerService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, eventId: string, data: any) {
    return this.prisma.eventSpeaker.create({
      data: {
        tenantId,
        eventId,
        name: data.name,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
        imageUrl: data.imageUrl,
        company: data.company,
        jobTitle: data.jobTitle,
        socialLinks: data.socialLinks || {},
      },
    });
  }

  async findAll(tenantId: string, eventId: string) {
    return this.prisma.eventSpeaker.findMany({
      where: { tenantId, eventId },
      include: {
        _count: {
          select: { tracks: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, eventId: string, id: string) {
    const speaker = await this.prisma.eventSpeaker.findFirst({
      where: { id, eventId, tenantId },
      include: {
        tracks: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!speaker) {
      throw new NotFoundException('Speaker not found');
    }

    return speaker;
  }

  async update(tenantId: string, eventId: string, id: string, data: any) {
    await this.findOne(tenantId, eventId, id);
    return this.prisma.eventSpeaker.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, eventId: string, id: string) {
    await this.findOne(tenantId, eventId, id);
    await this.prisma.eventSpeaker.delete({ where: { id } });
    return { message: 'Speaker deleted successfully' };
  }
}
