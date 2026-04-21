import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.timesheetEntry.create({
      data: {
        tenantId,
        employeeId: data.employeeId,
        projectId: data.projectId,
        taskId: data.taskId,
        date: data.date,
        hours: data.hours,
        description: data.description,
        isBillable: data.isBillable || false,
        billingRate: data.billingRate,
      },
    });
  }

  async startTimer(tenantId: string, data: any) {
    // Check if timer already running
    const activeTimer = await this.prisma.timesheetEntry.findFirst({
      where: {
        tenantId,
        employeeId: data.employeeId,
        timerStartedAt: { not: null },
        status: 'draft',
      },
    });

    if (activeTimer) {
      throw new Error('Timer already running');
    }

    return this.prisma.timesheetEntry.create({
      data: {
        tenantId,
        employeeId: data.employeeId,
        projectId: data.projectId,
        taskId: data.taskId,
        date: new Date(),
        hours: 0,
        description: data.description,
        isBillable: data.isBillable || false,
        billingRate: data.billingRate,
        timerStartedAt: new Date(),
      },
    });
  }

  async stopTimer(tenantId: string, entryId: string) {
    const entry = await this.prisma.timesheetEntry.findFirst({
      where: { id: entryId, tenantId },
    });

    if (!entry) {
      throw new NotFoundException('Timesheet entry not found');
    }

    if (!entry.timerStartedAt) {
      throw new Error('No active timer');
    }

    const now = new Date();
    const hours = (now.getTime() - entry.timerStartedAt.getTime()) / (1000 * 60 * 60);

    return this.prisma.timesheetEntry.update({
      where: { id: entryId },
      data: {
        hours,
        timerStartedAt: null,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    employeeId?: string;
    projectId?: string;
    taskId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    return this.prisma.timesheetEntry.findMany({
      where: {
        tenantId,
        ...(filters?.employeeId && { employeeId: filters.employeeId }),
        ...(filters?.projectId && { projectId: filters.projectId }),
        ...(filters?.taskId && { taskId: filters.taskId }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.startDate && filters?.endDate && {
          date: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      },
      orderBy: { date: 'desc' },
    });
  }

  async validate(tenantId: string, entryId: string, validatedBy: string) {
    const entry = await this.prisma.timesheetEntry.findFirst({
      where: { id: entryId, tenantId },
    });

    if (!entry) {
      throw new NotFoundException('Timesheet entry not found');
    }

    return this.prisma.timesheetEntry.update({
      where: { id: entryId },
      data: {
        status: 'validated',
        validatedBy,
        validatedAt: new Date(),
      },
    });
  }

  async getBillableTime(tenantId: string, filters?: {
    employeeId?: string;
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const entries = await this.findAll(tenantId, {
      ...filters,
      status: 'validated',
    });

    const billableEntries = entries.filter((e) => e.isBillable);

    const totalBillableHours = billableEntries.reduce(
      (sum, e) => sum + Number(e.hours),
      0,
    );

    const totalBillableAmount = billableEntries.reduce(
      (sum, e) => sum + Number(e.hours) * Number(e.billingRate || 0),
      0,
    );

    return {
      totalBillableHours,
      totalBillableAmount,
      entries: billableEntries,
    };
  }
}
