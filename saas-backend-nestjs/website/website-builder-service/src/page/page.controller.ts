import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('pages')
@Controller('websites/:websiteId/pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new page' })
  async create(
    @TenantId() tenantId: string,
    @Param('websiteId') websiteId: string,
    @Body() dto: CreatePageDto,
  ) {
    return this.pageService.create(tenantId, websiteId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pages for a website' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('websiteId') websiteId: string,
  ) {
    return this.pageService.findAll(tenantId, websiteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get page by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('websiteId') websiteId: string,
    @Param('id') id: string,
  ) {
    return this.pageService.findOne(tenantId, websiteId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update page' })
  async update(
    @TenantId() tenantId: string,
    @Param('websiteId') websiteId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreatePageDto>,
  ) {
    return this.pageService.update(tenantId, websiteId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete page' })
  async delete(
    @TenantId() tenantId: string,
    @Param('websiteId') websiteId: string,
    @Param('id') id: string,
  ) {
    return this.pageService.delete(tenantId, websiteId, id);
  }
}
