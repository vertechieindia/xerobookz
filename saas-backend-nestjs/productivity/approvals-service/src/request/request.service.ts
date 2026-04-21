import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    const approvalType = await this.prisma.approvalType.findFirst({
      where: { id: data.approvalTypeId, tenantId },
      include: { approvers: true },
    });

    if (!approvalType) {
      throw new NotFoundException('Approval type not found');
    }

    const request = await this.prisma.approvalRequest.create({
      data: {
        tenantId,
        approvalTypeId: data.approvalTypeId,
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        amount: data.amount,
        date: data.date,
        quantity: data.quantity,
        customData: data.customData || {},
      },
    });

    // Create approval records for each approver
    if (approvalType.approvers.length > 0) {
      await Promise.all(
        approvalType.approvers.map((approver) =>
          this.prisma.approval.create({
            data: {
              tenantId,
              requestId: request.id,
              approverId: approver.userId,
              status: 'pending',
            },
          }),
        ),
      );
    }

    return this.findOne(tenantId, request.id);
  }

  async findAll(tenantId: string, filters?: {
    requesterId?: string;
    status?: string;
    approvalTypeId?: string;
  }) {
    return this.prisma.approvalRequest.findMany({
      where: {
        tenantId,
        ...(filters?.requesterId && { requesterId: filters.requesterId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.approvalTypeId && { approvalTypeId: filters.approvalTypeId }),
      },
      include: {
        approvalType: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        approvals: {
          include: {
            // Would include user info if user service available
          },
        },
      },
      orderBy: { requestDate: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id, tenantId },
      include: {
        approvalType: {
          include: {
            approvers: true,
          },
        },
        approvals: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Approval request not found');
    }

    return request;
  }

  async getMyPendingApprovals(tenantId: string, approverId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        tenantId,
        status: 'pending',
        approvals: {
          some: {
            approverId,
            status: 'pending',
          },
        },
      },
      include: {
        approvalType: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        approvals: {
          where: {
            approverId,
          },
        },
      },
      orderBy: { requestDate: 'desc' },
    });
  }

  async cancel(tenantId: string, id: string, requesterId: string) {
    const request = await this.findOne(tenantId, id);

    if (request.requesterId !== requesterId) {
      throw new BadRequestException('Only requester can cancel the request');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    return this.prisma.approvalRequest.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  }
}
