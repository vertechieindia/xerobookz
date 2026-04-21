import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    // Check SKU uniqueness
    const existing = await this.prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existing) {
      throw new ConflictException('Product with this SKU already exists');
    }

    if (data.barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        throw new ConflictException('Product with this barcode already exists');
      }
    }

    return this.prisma.product.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        stockLevels: {
          include: {
            warehouse: true,
            location: true,
          },
        },
        variants: true,
      },
    });
  }

  async findAll(tenantId: string, filters?: { category?: string; type?: string; isActive?: boolean }) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      include: {
        stockLevels: {
          include: {
            warehouse: true,
          },
        },
        _count: {
          select: { variants: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByBarcode(tenantId: string, barcode: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        tenantId,
        OR: [
          { barcode },
          { variants: { some: { barcode } } },
        ],
      },
      include: {
        stockLevels: {
          include: {
            warehouse: true,
            location: true,
          },
        },
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findOne(tenantId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        stockLevels: {
          include: {
            warehouse: true,
            location: true,
          },
        },
        variants: {
          include: {
            stockLevels: {
              include: {
                warehouse: true,
              },
            },
          },
        },
        locations: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);

    // Check SKU uniqueness if changing
    if (data.sku) {
      const existing = await this.prisma.product.findFirst({
        where: { sku: data.sku, id: { not: id } },
      });

      if (existing) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        stockLevels: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}
