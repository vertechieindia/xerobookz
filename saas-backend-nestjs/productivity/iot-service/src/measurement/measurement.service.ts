import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class MeasurementService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Verify operation exists
    const operation = await this.prisma.ioTDeviceOperation.findFirst({
      where: { id: data.operationId, tenantId },
    });

    if (!operation) {
      throw new NotFoundException('Device operation not found');
    }

    return this.prisma.ioTMeasurement.create({
      data: {
        tenantId,
        operationId: data.operationId,
        productId: data.productId,
        measurementType: data.measurementType,
        value: data.value,
        unit: data.unit,
        metadata: data.metadata || {},
      },
      include: {
        operation: {
          include: {
            device: {
              select: {
                id: true,
                name: true,
                deviceType: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    operationId?: string;
    productId?: string;
    measurementType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.ioTMeasurement.findMany({
      where: {
        tenantId,
        ...(filters?.operationId && { operationId: filters.operationId }),
        ...(filters?.productId && { productId: filters.productId }),
        ...(filters?.measurementType && { measurementType: filters.measurementType }),
        ...(filters?.startDate && filters?.endDate && {
          timestamp: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      },
      include: {
        operation: {
          include: {
            device: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }
}
