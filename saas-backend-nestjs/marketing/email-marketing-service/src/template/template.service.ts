import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.emailTemplate.create({
      data: {
        tenantId,
        name: data.name,
        subject: data.subject,
        category: data.category,
        content: data.content || {},
        preview: data.preview,
        isPublic: data.isPublic || false,
      },
    });
  }

  async findAll(tenantId: string, filters?: { category?: string; includePublic?: boolean }) {
    const where: any = {
      OR: [
        { tenantId },
        ...(filters?.includePublic ? [{ isPublic: true }] : []),
      ],
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    return this.prisma.emailTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const template = await this.prisma.emailTemplate.findFirst({
      where: {
        id,
        OR: [
          { tenantId },
          { isPublic: true },
        ],
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.emailTemplate.update({
      where: { id },
      data: {
        name: data.name,
        subject: data.subject,
        category: data.category,
        content: data.content,
        preview: data.preview,
        isPublic: data.isPublic,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.emailTemplate.delete({ where: { id } });
    return { message: 'Template deleted successfully' };
  }
}
