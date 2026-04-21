import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, employeeId: string, data: any) {
    // Verify employee exists
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.employeeDocument.create({
      data: {
        tenantId,
        employeeId,
        ...data,
      },
    });
  }

  async findAll(tenantId: string, employeeId: string, filters?: { documentType?: string }) {
    return this.prisma.employeeDocument.findMany({
      where: {
        tenantId,
        employeeId,
        ...(filters?.documentType && { documentType: filters.documentType }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const document = await this.prisma.employeeDocument.findFirst({
      where: { id, tenantId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.employeeDocument.update({
      where: { id },
      data,
    });
  }

  async markAsSigned(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.employeeDocument.update({
      where: { id },
      data: { signedAt: new Date() },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.employeeDocument.delete({ where: { id } });
    return { message: 'Document deleted successfully' };
  }

  async getExpiringDocuments(tenantId: string, days: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return this.prisma.employeeDocument.findMany({
      where: {
        tenantId,
        expiresAt: {
          lte: expiryDate,
          gte: new Date(),
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }
}
