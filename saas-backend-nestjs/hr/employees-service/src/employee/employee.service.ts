import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Check employee number uniqueness
    const existingNumber = await this.prisma.employee.findUnique({
      where: { employeeNumber: data.employeeNumber },
    });

    if (existingNumber) {
      throw new ConflictException('Employee with this number already exists');
    }

    // Check email uniqueness
    const existingEmail = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new ConflictException('Employee with this email already exists');
    }

    return this.prisma.employee.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        skills: true,
        documents: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            subordinates: true,
            documents: true,
            skills: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    departmentId?: string;
    managerId?: string;
    status?: string;
    contractType?: string;
  }) {
    return this.prisma.employee.findMany({
      where: {
        tenantId,
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
        ...(filters?.managerId && { managerId: filters.managerId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.contractType && { contractType: filters.contractType }),
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            subordinates: true,
            documents: true,
            skills: true,
          },
        },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
            status: true,
          },
        },
        skills: {
          orderBy: { skillName: 'asc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        emergencyContacts: true,
        addresses: true,
        bankAccounts: true,
        contracts: {
          orderBy: { startDate: 'desc' },
        },
        attendanceRecords: {
          take: 10,
          orderBy: { checkIn: 'desc' },
        },
        timeOffRequests: {
          take: 5,
          orderBy: { startDate: 'desc' },
        },
        appraisals: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);

    // Check uniqueness if changing
    if (data.employeeNumber) {
      const existing = await this.prisma.employee.findFirst({
        where: { employeeNumber: data.employeeNumber, id: { not: id } },
      });

      if (existing) {
        throw new ConflictException('Employee with this number already exists');
      }
    }

    if (data.email) {
      const existing = await this.prisma.employee.findFirst({
        where: { email: data.email, id: { not: id } },
      });

      if (existing) {
        throw new ConflictException('Employee with this email already exists');
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data,
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        skills: true,
        documents: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getOrgChart(tenantId: string, rootEmployeeId?: string) {
    if (rootEmployeeId) {
      const root = await this.findOne(tenantId, rootEmployeeId);
      return this.buildOrgChartNode(root);
    }

    // Get all top-level employees (no manager)
    const topLevel = await this.prisma.employee.findMany({
      where: {
        tenantId,
        managerId: null,
        isActive: true,
      },
      include: {
        subordinates: {
          where: { isActive: true },
          include: {
            subordinates: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return topLevel.map((emp) => this.buildOrgChartNode(emp));
  }

  private buildOrgChartNode(employee: any) {
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      title: employee.jobTitle,
      email: employee.email,
      avatar: employee.avatarUrl,
      children: employee.subordinates?.map((sub: any) => this.buildOrgChartNode(sub)) || [],
    };
  }

  async getPresenceReport(tenantId: string, filters?: {
    departmentId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const employees = await this.findAll(tenantId, {
      departmentId: filters?.departmentId,
    });

    const report = await Promise.all(
      employees.map(async (emp) => {
        const attendance = await this.prisma.attendanceRecord.findMany({
          where: {
            tenantId,
            employeeId: emp.id,
            ...(filters?.startDate && filters?.endDate && {
              checkIn: {
                gte: filters.startDate,
                lte: filters.endDate,
              },
            }),
          },
        });

        const totalHours = attendance.reduce((sum, record) => {
          return sum + Number(record.workHours || 0);
        }, 0);

        return {
          employee: {
            id: emp.id,
            name: `${emp.firstName} ${emp.lastName}`,
            email: emp.email,
            jobTitle: emp.jobTitle,
          },
          totalDays: attendance.length,
          totalHours,
          averageHoursPerDay: attendance.length > 0 ? totalHours / attendance.length : 0,
        };
      }),
    );

    return report;
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.employee.update({
      where: { id },
      data: { isActive: false, status: 'inactive' },
    });
    return { message: 'Employee deactivated successfully' };
  }
}
