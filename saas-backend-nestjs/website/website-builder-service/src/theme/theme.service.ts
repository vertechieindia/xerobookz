import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.theme.findMany({
      where: { isDefault: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const theme = await this.prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    return theme;
  }

  async findBySlug(slug: string) {
    const theme = await this.prisma.theme.findUnique({
      where: { slug },
    });

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    return theme;
  }

  async getDefaultThemes() {
    // Return predefined themes (these would be seeded)
    return [
      {
        id: 'default-business',
        name: 'Business',
        slug: 'business',
        category: 'business',
        isDefault: true,
        isPremium: false,
        config: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            accent: '#28a745',
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter',
          },
        },
      },
      {
        id: 'default-portfolio',
        name: 'Portfolio',
        slug: 'portfolio',
        category: 'portfolio',
        isDefault: true,
        isPremium: false,
        config: {
          colors: {
            primary: '#000000',
            secondary: '#ffffff',
            accent: '#ff6b6b',
          },
          fonts: {
            heading: 'Playfair Display',
            body: 'Lato',
          },
        },
      },
      {
        id: 'default-ecommerce',
        name: 'E-Commerce',
        slug: 'ecommerce',
        category: 'ecommerce',
        isDefault: true,
        isPremium: false,
        config: {
          colors: {
            primary: '#ff6b6b',
            secondary: '#4ecdc4',
            accent: '#ffe66d',
          },
          fonts: {
            heading: 'Montserrat',
            body: 'Open Sans',
          },
        },
      },
    ];
  }
}
