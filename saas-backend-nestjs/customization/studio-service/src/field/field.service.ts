import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class FieldService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Verify model exists if modelId provided
    if (data.modelId) {
      const model = await this.prisma.customModel.findFirst({
        where: { id: data.modelId, tenantId },
      });

      if (!model) {
        throw new NotFoundException('Custom model not found');
      }
    }

    return this.prisma.customField.create({
      data: {
        tenantId,
        modelId: data.modelId,
        baseModel: data.baseModel,
        name: data.name,
        label: data.label,
        fieldType: data.fieldType,
        isRequired: data.isRequired || false,
        defaultValue: data.defaultValue,
        helpText: data.helpText,
        selectionOptions: data.selectionOptions,
        relationModel: data.relationModel,
        displayOrder: data.displayOrder || 0,
        isReadonly: data.isReadonly || false,
        conditionalVisibility: data.conditionalVisibility,
        conditionalRequired: data.conditionalRequired,
      },
    });
  }

  async findAll(tenantId: string, filters?: { modelId?: string; baseModel?: string }) {
    return this.prisma.customField.findMany({
      where: {
        tenantId,
        ...(filters?.modelId && { modelId: filters.modelId }),
        ...(filters?.baseModel && { baseModel: filters.baseModel }),
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const field = await this.prisma.customField.findFirst({
      where: { id, tenantId },
    });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    return field;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.customField.update({
      where: { id },
      data: {
        label: data.label,
        isRequired: data.isRequired,
        defaultValue: data.defaultValue,
        helpText: data.helpText,
        selectionOptions: data.selectionOptions,
        displayOrder: data.displayOrder,
        isReadonly: data.isReadonly,
        conditionalVisibility: data.conditionalVisibility,
        conditionalRequired: data.conditionalRequired,
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.customField.delete({ where: { id } });
    return { message: 'Custom field deleted successfully' };
  }
}
