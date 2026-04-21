import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    if (data.code) {
      const existing = await this.prisma.department.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new ConflictException('Department with this code already exists');
      }
    }

    return this.prisma.department.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.department.findMany({
      where: { tenantId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const department = await this.prisma.department.findFirst({
      where: { id, tenantId },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);

    if (data.code) {
      const existing = await this.prisma.department.findFirst({
        where: { code: data.code, id: { not: id } },
      });

      if (existing) {
        throw new ConflictException('Department with this code already exists');
      }
    }

    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.department.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Department deactivated successfully' };
  }
}
