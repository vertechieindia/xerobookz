import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class BoxService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.ioTBox.create({
      data: {
        tenantId,
        name: data.name,
        serialNumber: data.serialNumber,
        ipAddress: data.ipAddress,
        location: data.location,
      },
      include: {
        _count: {
          select: { devices: true },
        },
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.ioTBox.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { devices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const box = await this.prisma.ioTBox.findFirst({
      where: { id, tenantId },
      include: {
        devices: true,
        _count: {
          select: { devices: true },
        },
      },
    });

    if (!box) {
      throw new NotFoundException('IoT Box not found');
    }

    return box;
  }

  async updateStatus(tenantId: string, serialNumber: string, status: string, ipAddress?: string) {
    const box = await this.prisma.ioTBox.findUnique({
      where: { serialNumber },
    });

    if (!box || box.tenantId !== tenantId) {
      throw new NotFoundException('IoT Box not found');
    }

    return this.prisma.ioTBox.update({
      where: { id: box.id },
      data: {
        status,
        ipAddress,
        lastSeen: new Date(),
      },
    });
  }
}
