import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create document template' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.templateService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all document templates' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('model') model?: string,
    @Query('templateType') templateType?: string,
  ) {
    return this.templateService.findAll(tenantId, { model, templateType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document template by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.templateService.findOne(tenantId, id);
  }

  @Post(':id/render')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Render document template with data' })
  async render(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { data: any },
  ) {
    return this.templateService.render(tenantId, id, body.data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document template' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.templateService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete document template' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.templateService.delete(tenantId, id);
  }
}
