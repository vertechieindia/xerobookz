import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.event.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        eventType: data.eventType,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        address: data.address,
        website: data.website,
        imageUrl: data.imageUrl,
        seoSettings: data.seoSettings || {},
        settings: data.settings || {},
      },
      include: {
        tickets: true,
        _count: {
          select: {
            registrations: true,
            tracks: true,
            speakers: true,
            sponsors: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string; eventType?: string }) {
    return this.prisma.event.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.eventType && { eventType: filters.eventType }),
      },
      include: {
        _count: {
          select: {
            registrations: true,
            tickets: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, tenantId },
      include: {
        tickets: {
          where: { isActive: true },
        },
        tracks: {
          include: {
            speaker: true,
          },
          orderBy: { startDate: 'asc' },
        },
        speakers: true,
        sponsors: {
          orderBy: { sponsorLevel: 'asc' },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.event.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        eventType: data.eventType,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        address: data.address,
        website: data.website,
        imageUrl: data.imageUrl,
        status: data.status,
        isPublished: data.isPublished,
        seoSettings: data.seoSettings,
        settings: data.settings,
      },
    });
  }

  async publish(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.event.update({
      where: { id },
      data: { isPublished: true, status: 'published' },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted successfully' };
  }
}
