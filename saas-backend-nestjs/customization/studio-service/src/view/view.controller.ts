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
import { ViewService } from './view.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('views')
@Controller('views')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create custom view' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.viewService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all custom views' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('modelId') modelId?: string,
    @Query('baseModel') baseModel?: string,
    @Query('viewType') viewType?: string,
  ) {
    return this.viewService.findAll(tenantId, { modelId, baseModel, viewType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom view by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.viewService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update custom view' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.viewService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete custom view' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.viewService.delete(tenantId, id);
  }
}
