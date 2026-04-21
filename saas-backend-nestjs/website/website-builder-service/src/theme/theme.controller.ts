import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ThemeService } from './theme.service';

@ApiTags('themes')
@Controller('themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available themes' })
  async findAll() {
    return this.themeService.findAll();
  }

  @Get('defaults')
  @ApiOperation({ summary: 'Get default themes' })
  async getDefaultThemes() {
    return this.themeService.getDefaultThemes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get theme by ID' })
  async findOne(@Param('id') id: string) {
    return this.themeService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get theme by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.themeService.findBySlug(slug);
  }
}
