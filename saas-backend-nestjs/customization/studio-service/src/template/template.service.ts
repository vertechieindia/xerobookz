import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // If this is set as default, unset other defaults for the same model
    if (data.isDefault) {
      await this.prisma.documentTemplate.updateMany({
        where: {
          tenantId,
          model: data.model,
          templateType: data.templateType,
        },
        data: { isDefault: false },
      });
    }

    return this.prisma.documentTemplate.create({
      data: {
        tenantId,
        name: data.name,
        model: data.model,
        templateType: data.templateType,
        content: data.content,
        variables: data.variables || {},
        isDefault: data.isDefault || false,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    model?: string;
    templateType?: string;
  }) {
    return this.prisma.documentTemplate.findMany({
      where: {
        tenantId,
        ...(filters?.model && { model: filters.model }),
        ...(filters?.templateType && { templateType: filters.templateType }),
        isActive: true,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(tenantId: string, id: string) {
    const template = await this.prisma.documentTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Document template not found');
    }

    return template;
  }

  async render(tenantId: string, id: string, data: any) {
    const template = await this.findOne(tenantId, id);

    // TODO: Implement actual template rendering
    // This would parse the template content and replace variables with data
    let rendered = template.content;

    if (template.variables && data) {
      Object.keys(template.variables).forEach((key) => {
        const value = data[key] || '';
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
    }

    return {
      template: template.name,
      rendered,
      format: template.templateType,
    };
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.documentTemplate.update({
      where: { id },
      data: {
        name: data.name,
        content: data.content,
        variables: data.variables,
        isDefault: data.isDefault,
        isActive: data.isActive,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.documentTemplate.delete({ where: { id } });
    return { message: 'Document template deleted successfully' };
  }
}
