import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, websiteId: string, dto: CreatePageDto) {
    // Verify website exists and belongs to tenant
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, tenantId },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    // Check slug uniqueness within website
    const existingPage = await this.prisma.page.findFirst({
      where: {
        websiteId,
        slug: dto.slug,
      },
    });

    if (existingPage) {
      throw new ConflictException('Page with this slug already exists');
    }

    // If setting as home page, unset other home pages
    if (dto.isHomePage) {
      await this.prisma.page.updateMany({
        where: { websiteId, isHomePage: true },
        data: { isHomePage: false },
      });
    }

    return this.prisma.page.create({
      data: {
        websiteId,
        tenantId,
        title: dto.title,
        slug: dto.slug,
        path: dto.path,
        isHomePage: dto.isHomePage || false,
        isPublished: dto.isPublished || false,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        content: dto.content,
        settings: dto.settings || {},
      },
    });
  }

  async findAll(tenantId: string, websiteId: string) {
    return this.prisma.page.findMany({
      where: { websiteId, tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(tenantId: string, websiteId: string, id: string) {
    const page = await this.prisma.page.findFirst({
      where: { id, websiteId, tenantId },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(
    tenantId: string,
    websiteId: string,
    id: string,
    dto: Partial<CreatePageDto>,
  ) {
    await this.findOne(tenantId, websiteId, id);

    // Handle home page change
    if (dto.isHomePage) {
      await this.prisma.page.updateMany({
        where: { websiteId, isHomePage: true, id: { not: id } },
        data: { isHomePage: false },
      });
    }

    return this.prisma.page.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        path: dto.path,
        isHomePage: dto.isHomePage,
        isPublished: dto.isPublished,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
        content: dto.content,
        settings: dto.settings,
      },
    });
  }

  async delete(tenantId: string, websiteId: string, id: string) {
    await this.findOne(tenantId, websiteId, id);
    await this.prisma.page.delete({ where: { id } });
    return { message: 'Page deleted successfully' };
  }
}
