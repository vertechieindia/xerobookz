import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SummaryService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(tenantId: string, employeeId: string, data: {
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
  }) {
    // Get all entries for period
    const entries = await this.prisma.timesheetEntry.findMany({
      where: {
        tenantId,
        employeeId,
        date: {
          gte: data.periodStart,
          lte: data.periodEnd,
        },
      },
    });

    const totalHours = entries.reduce((sum, e) => sum + Number(e.hours), 0);
    const billableHours = entries
      .filter((e) => e.isBillable)
      .reduce((sum, e) => sum + Number(e.hours), 0);

    // Calculate overtime (assuming 40 hours/week standard)
    const standardHours = data.periodType === 'week' ? 40 : 160; // 4 weeks
    const overtimeHours = totalHours > standardHours ? totalHours - standardHours : 0;

    return this.prisma.timesheetSummary.upsert({
      where: {
        employeeId_periodType_periodStart: {
          employeeId,
          periodType: data.periodType,
          periodStart: data.periodStart,
        },
      },
      update: {
        totalHours,
        billableHours,
        overtimeHours,
      },
      create: {
        tenantId,
        employeeId,
        periodType: data.periodType,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        totalHours,
        billableHours,
        overtimeHours,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    employeeId?: string;
    periodType?: string;
    status?: string;
  }) {
    return this.prisma.timesheetSummary.findMany({
      where: {
        tenantId,
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
        ...(filters?.periodType && { periodType: filters.periodType }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { periodStart: 'desc' },
    });
  }

  async submit(tenantId: string, id: string) {
    const summary = await this.prisma.timesheetSummary.findFirst({
      where: { id, tenantId },
    });

    if (!summary) {
      throw new NotFoundException('Timesheet summary not found');
    }

    return this.prisma.timesheetSummary.update({
      where: { id },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
    });
  }

  async validate(tenantId: string, id: string, validatedBy: string) {
    const summary = await this.prisma.timesheetSummary.findFirst({
      where: { id, tenantId },
    });

    if (!summary) {
      throw new NotFoundException('Timesheet summary not found');
    }

    return this.prisma.timesheetSummary.update({
      where: { id },
      data: {
        status: 'validated',
        validatedAt: new Date(),
      },
    });
  }
}
