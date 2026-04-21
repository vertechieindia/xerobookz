import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class OperationService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Verify device exists
    const device = await this.prisma.ioTDevice.findFirst({
      where: { id: data.deviceId, tenantId },
    });

    if (!device) {
      throw new NotFoundException('IoT Device not found');
    }

    return this.prisma.ioTDeviceOperation.create({
      data: {
        tenantId,
        deviceId: data.deviceId,
        operationType: data.operationType,
        linkedToType: data.linkedToType,
        linkedToId: data.linkedToId,
        parameters: data.parameters || {},
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            deviceType: true,
          },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    deviceId?: string;
    operationType?: string;
    linkedToType?: string;
    linkedToId?: string;
  }) {
    return this.prisma.ioTDeviceOperation.findMany({
      where: {
        tenantId,
        ...(filters?.deviceId && { deviceId: filters.deviceId }),
        ...(filters?.operationType && { operationType: filters.operationType }),
        ...(filters?.linkedToType && { linkedToType: filters.linkedToType }),
        ...(filters?.linkedToId && { linkedToId: filters.linkedToId }),
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            deviceType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
