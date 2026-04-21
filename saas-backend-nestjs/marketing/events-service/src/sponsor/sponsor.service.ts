import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SponsorService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, eventId: string, data: any) {
    return this.prisma.eventSponsor.create({
      data: {
        tenantId,
        eventId,
        name: data.name,
        logoUrl: data.logoUrl,
        website: data.website,
        sponsorLevel: data.sponsorLevel,
        amount: data.amount,
        description: data.description,
      },
    });
  }

  async findAll(tenantId: string, eventId: string) {
    return this.prisma.eventSponsor.findMany({
      where: { tenantId, eventId },
      orderBy: [
        { sponsorLevel: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findOne(tenantId: string, eventId: string, id: string) {
    const sponsor = await this.prisma.eventSponsor.findFirst({
      where: { id, eventId, tenantId },
    });

    if (!sponsor) {
      throw new NotFoundException('Sponsor not found');
    }

    return sponsor;
  }

  async update(tenantId: string, eventId: string, id: string, data: any) {
    await this.findOne(tenantId, eventId, id);
    return this.prisma.eventSponsor.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, eventId: string, id: string) {
    await this.findOne(tenantId, eventId, id);
    await this.prisma.eventSponsor.delete({ where: { id } });
    return { message: 'Sponsor deleted successfully' };
  }
}
