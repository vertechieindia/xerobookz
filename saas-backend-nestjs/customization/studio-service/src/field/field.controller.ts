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
import { FieldService } from './field.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('fields')
@Controller('fields')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create custom field' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.fieldService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all custom fields' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('modelId') modelId?: string,
    @Query('baseModel') baseModel?: string,
  ) {
    return this.fieldService.findAll(tenantId, { modelId, baseModel });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom field by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fieldService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update custom field' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.fieldService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete custom field' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fieldService.delete(tenantId, id);
  }
}
