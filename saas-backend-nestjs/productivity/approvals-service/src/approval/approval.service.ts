import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ApprovalService {
  constructor(private prisma: PrismaService) {}

  async approve(tenantId: string, requestId: string, approverId: string, comment?: string) {
    const approval = await this.prisma.approval.findFirst({
      where: {
        requestId,
        approverId,
        tenantId,
      },
      include: {
        request: {
          include: {
            approvalType: {
              include: {
                approvers: true,
              },
            },
          },
        },
      },
    });

    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    if (approval.status !== 'pending') {
      throw new BadRequestException('Approval already processed');
    }

    // Update approval
    await this.prisma.approval.update({
      where: { id: approval.id },
      data: {
        status: 'approved',
        comment,
        approvedAt: new Date(),
      },
    });

    // Check if all required approvals are done
    const request = await this.prisma.approvalRequest.findFirst({
      where: { id: requestId, tenantId },
      include: {
        approvalType: true,
        approvals: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const approvalMethod = request.approvalType.approvalMethod;
    const allApprovals = request.approvals;

    let shouldApproveRequest = false;

    if (approvalMethod === 'all') {
      // All required approvers must approve
      const requiredApprovers = request.approvalType.approvers.filter((a) => a.isRequired);
      const requiredApprovals = allApprovals.filter((a) =>
        requiredApprovers.some((ra) => ra.userId === a.approverId),
      );
      shouldApproveRequest = requiredApprovals.every((a) => a.status === 'approved');
    } else {
      // Any approver can approve
      shouldApproveRequest = allApprovals.some((a) => a.status === 'approved');
    }

    if (shouldApproveRequest) {
      await this.prisma.approvalRequest.update({
        where: { id: requestId },
        data: {
          status: 'approved',
          approvedAt: new Date(),
        },
      });
    }

    return this.prisma.approvalRequest.findFirst({
      where: { id: requestId, tenantId },
      include: {
        approvals: true,
      },
    });
  }

  async refuse(tenantId: string, requestId: string, approverId: string, reason: string) {
    const approval = await this.prisma.approval.findFirst({
      where: {
        requestId,
        approverId,
        tenantId,
      },
    });

    if (!approval) {
      throw new NotFoundException('Approval not found');
    }

    if (approval.status !== 'pending') {
      throw new BadRequestException('Approval already processed');
    }

    // Update approval
    await this.prisma.approval.update({
      where: { id: approval.id },
      data: {
        status: 'refused',
        comment: reason,
        refusedAt: new Date(),
      },
    });

    // Refuse the entire request
    await this.prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status: 'refused',
        refusedAt: new Date(),
        refusedReason: reason,
      },
    });

    return this.prisma.approvalRequest.findFirst({
      where: { id: requestId, tenantId },
      include: {
        approvals: true,
      },
    });
  }
}
