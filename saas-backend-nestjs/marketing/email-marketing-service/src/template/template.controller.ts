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
  @ApiOperation({ summary: 'Create email template' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.templateService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('category') category?: string,
    @Query('includePublic') includePublic?: string,
  ) {
    return this.templateService.findAll(tenantId, {
      category,
      includePublic: includePublic === 'true',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.templateService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update template' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.templateService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete template' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.templateService.delete(tenantId, id);
  }
}
