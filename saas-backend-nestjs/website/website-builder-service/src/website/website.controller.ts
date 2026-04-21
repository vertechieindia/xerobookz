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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto, UpdateWebsiteDto } from './dto';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('websites')
@Controller('websites')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new website' })
  @ApiResponse({ status: 201, description: 'Website created successfully' })
  async create(
    @TenantId() tenantId: string,
    @Body() dto: CreateWebsiteDto,
  ) {
    return this.websiteService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all websites for tenant' })
  @ApiResponse({ status: 200, description: 'Websites retrieved successfully' })
  async findAll(@TenantId() tenantId: string) {
    return this.websiteService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get website by ID' })
  @ApiResponse({ status: 200, description: 'Website retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Website not found' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.websiteService.findOne(tenantId, id);
  }

  @Get('domain/:domain')
  @ApiOperation({ summary: 'Get website by domain' })
  @ApiResponse({ status: 200, description: 'Website retrieved successfully' })
  async findByDomain(@Param('domain') domain: string) {
    return this.websiteService.findByDomain(domain);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update website' })
  @ApiResponse({ status: 200, description: 'Website updated successfully' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWebsiteDto,
  ) {
    return this.websiteService.update(tenantId, id, dto);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish website' })
  @ApiResponse({ status: 200, description: 'Website published successfully' })
  async publish(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.websiteService.publish(tenantId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete website' })
  @ApiResponse({ status: 200, description: 'Website deleted successfully' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.websiteService.delete(tenantId, id);
  }
}
