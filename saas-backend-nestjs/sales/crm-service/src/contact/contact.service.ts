import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.contact.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.contact.findMany({
      where: { tenantId },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        opportunities: {
          select: {
            id: true,
            name: true,
            stage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, tenantId },
      include: {
        lead: true,
        opportunities: true,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Contact deleted successfully' };
  }
}
