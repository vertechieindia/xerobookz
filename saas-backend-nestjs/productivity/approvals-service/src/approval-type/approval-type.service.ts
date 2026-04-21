import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ApprovalTypeService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    const approvalType = await this.prisma.approvalType.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        category: data.category,
        approvalMethod: data.approvalMethod || 'all',
        hasAmount: data.hasAmount || false,
        hasDate: data.hasDate || false,
        hasQuantity: data.hasQuantity || false,
        customFields: data.customFields || {},
      },
    });

    // Add approvers if provided
    if (data.approvers && data.approvers.length > 0) {
      await Promise.all(
        data.approvers.map((approver: any, index: number) =>
          this.prisma.approvalTypeApprover.create({
            data: {
              tenantId,
              approvalTypeId: approvalType.id,
              userId: approver.userId,
              sequence: approver.sequence || index,
              isRequired: approver.isRequired !== undefined ? approver.isRequired : true,
            },
          }),
        ),
      );
    }

    return this.findOne(tenantId, approvalType.id);
  }

  async findAll(tenantId: string, filters?: { category?: string; isActive?: boolean }) {
    return this.prisma.approvalType.findMany({
      where: {
        tenantId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: {
        approvers: {
          orderBy: { sequence: 'asc' },
        },
        _count: {
          select: { requests: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const approvalType = await this.prisma.approvalType.findFirst({
      where: { id, tenantId },
      include: {
        approvers: {
          orderBy: { sequence: 'asc' },
        },
        _count: {
          select: { requests: true },
        },
      },
    });

    if (!approvalType) {
      throw new NotFoundException('Approval type not found');
    }

    return approvalType;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.approvalType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        approvalMethod: data.approvalMethod,
        hasAmount: data.hasAmount,
        hasDate: data.hasDate,
        hasQuantity: data.hasQuantity,
        customFields: data.customFields,
        isActive: data.isActive,
      },
    });
  }

  async addApprover(tenantId: string, approvalTypeId: string, data: any) {
    await this.findOne(tenantId, approvalTypeId);
    return this.prisma.approvalTypeApprover.create({
      data: {
        tenantId,
        approvalTypeId,
        userId: data.userId,
        sequence: data.sequence || 0,
        isRequired: data.isRequired !== undefined ? data.isRequired : true,
      },
    });
  }

  async removeApprover(tenantId: string, approvalTypeId: string, approverId: string) {
    await this.findOne(tenantId, approvalTypeId);
    await this.prisma.approvalTypeApprover.deleteMany({
      where: { approvalTypeId, id: approverId, tenantId },
    });
    return { message: 'Approver removed successfully' };
  }
}
