import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Verify box exists
    const box = await this.prisma.ioTBox.findFirst({
      where: { id: data.boxId, tenantId },
    });

    if (!box) {
      throw new NotFoundException('IoT Box not found');
    }

    return this.prisma.ioTDevice.create({
      data: {
        tenantId,
        boxId: data.boxId,
        name: data.name,
        deviceType: data.deviceType,
        deviceModel: data.deviceModel,
        connectionType: data.connectionType,
        configuration: data.configuration || {},
      },
      include: {
        box: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { boxId?: string; deviceType?: string }) {
    return this.prisma.ioTDevice.findMany({
      where: {
        tenantId,
        ...(filters?.boxId && { boxId: filters.boxId }),
        ...(filters?.deviceType && { deviceType: filters.deviceType }),
      },
      include: {
        box: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { operations: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const device = await this.prisma.ioTDevice.findFirst({
      where: { id, tenantId },
      include: {
        box: true,
        operations: true,
      },
    });

    if (!device) {
      throw new NotFoundException('IoT Device not found');
    }

    return device;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    await this.findOne(tenantId, id);
    return this.prisma.ioTDevice.update({
      where: { id },
      data: {
        status,
        lastSeen: new Date(),
      },
    });
  }
}
