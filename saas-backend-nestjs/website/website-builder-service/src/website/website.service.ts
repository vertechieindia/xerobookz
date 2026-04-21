import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto';

@Injectable()
export class WebsiteService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateWebsiteDto) {
    // Validate domain/subdomain uniqueness
    if (dto.domain) {
      const existingDomain = await this.prisma.website.findUnique({
        where: { domain: dto.domain },
      });
      if (existingDomain) {
        throw new ConflictException('Domain already in use');
      }
    }

    if (dto.subdomain) {
      const existingSubdomain = await this.prisma.website.findUnique({
        where: { subdomain: dto.subdomain },
      });
      if (existingSubdomain) {
        throw new ConflictException('Subdomain already in use');
      }
    }

    // Validate theme if provided
    if (dto.themeId) {
      const theme = await this.prisma.theme.findUnique({
        where: { id: dto.themeId },
      });
      if (!theme) {
        throw new NotFoundException('Theme not found');
      }
    }

    const website = await this.prisma.website.create({
      data: {
        tenantId,
        name: dto.name,
        domain: dto.domain,
        subdomain: dto.subdomain,
        themeId: dto.themeId,
        settings: dto.settings || {},
        seoSettings: dto.seoSettings || {},
      },
      include: {
        theme: true,
        pages: {
          where: { isPublished: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return website;
  }

  async findAll(tenantId: string) {
    return this.prisma.website.findMany({
      where: { tenantId },
      include: {
        theme: true,
        _count: {
          select: { pages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const website = await this.prisma.website.findFirst({
      where: { id, tenantId },
      include: {
        theme: true,
        pages: {
          orderBy: { createdAt: 'asc' },
        },
        menus: true,
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return website;
  }

  async findByDomain(domain: string) {
    const website = await this.prisma.website.findUnique({
      where: { domain },
      include: {
        theme: true,
        pages: {
          where: { isPublished: true },
          orderBy: { createdAt: 'asc' },
        },
        menus: true,
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    return website;
  }

  async update(tenantId: string, id: string, dto: UpdateWebsiteDto) {
    const website = await this.findOne(tenantId, id);

    // Validate domain/subdomain if changing
    if (dto.domain && dto.domain !== website.domain) {
      const existing = await this.prisma.website.findUnique({
        where: { domain: dto.domain },
      });
      if (existing) {
        throw new ConflictException('Domain already in use');
      }
    }

    if (dto.subdomain && dto.subdomain !== website.subdomain) {
      const existing = await this.prisma.website.findUnique({
        where: { subdomain: dto.subdomain },
      });
      if (existing) {
        throw new ConflictException('Subdomain already in use');
      }
    }

    return this.prisma.website.update({
      where: { id },
      data: {
        name: dto.name,
        domain: dto.domain,
        subdomain: dto.subdomain,
        themeId: dto.themeId,
        settings: dto.settings,
        seoSettings: dto.seoSettings,
        status: dto.status as any,
      },
      include: {
        theme: true,
      },
    });
  }

  async publish(tenantId: string, id: string) {
    const website = await this.findOne(tenantId, id);

    if (!website.pages.some((p) => p.isHomePage && p.isPublished)) {
      throw new BadRequestException('Home page must be published first');
    }

    return this.prisma.website.update({
      where: { id },
      data: { status: 'published' },
      include: {
        theme: true,
        pages: {
          where: { isPublished: true },
        },
      },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.website.delete({ where: { id } });
    return { message: 'Website deleted successfully' };
  }
}
