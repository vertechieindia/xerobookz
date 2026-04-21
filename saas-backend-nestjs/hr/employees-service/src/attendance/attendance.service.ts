import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(tenantId: string, employeeId: string, data: { location?: string }) {
    // Verify employee exists
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, tenantId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await this.prisma.attendanceRecord.findFirst({
      where: {
        tenantId,
        employeeId,
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
        checkOut: null,
      },
    });

    if (existing) {
      throw new Error('Employee already checked in today');
    }

    return this.prisma.attendanceRecord.create({
      data: {
        tenantId,
        employeeId,
        checkIn: new Date(),
        location: data.location,
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
    });
  }

  async checkOut(tenantId: string, employeeId: string, data: { location?: string; notes?: string }) {
    // Find today's check-in
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: {
        tenantId,
        employeeId,
        checkIn: {
          gte: today,
          lt: tomorrow,
        },
        checkOut: null,
      },
    });

    if (!record) {
      throw new NotFoundException('No active check-in found');
    }

    const checkOut = new Date();
    const workHours = (checkOut.getTime() - record.checkIn.getTime()) / (1000 * 60 * 60);

    return this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut,
        workHours,
        notes: data.notes,
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
    });
  }

  async getRecords(tenantId: string, filters?: {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.attendanceRecord.findMany({
      where: {
        tenantId,
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
        ...(filters?.startDate && filters?.endDate && {
          checkIn: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { checkIn: 'desc' },
    });
  }

  async getEmployeeAttendance(tenantId: string, employeeId: string, startDate?: Date, endDate?: Date) {
    return this.prisma.attendanceRecord.findMany({
      where: {
        tenantId,
        employeeId,
        ...(startDate && endDate && {
          checkIn: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
      orderBy: { checkIn: 'desc' },
    });
  }
}
