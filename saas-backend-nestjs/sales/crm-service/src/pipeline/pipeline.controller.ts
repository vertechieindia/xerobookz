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
import { PipelineService } from './pipeline.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('pipelines')
@Controller('pipelines')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new pipeline' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.pipelineService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pipelines' })
  async findAll(@TenantId() tenantId: string) {
    return this.pipelineService.findAll(tenantId);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default pipeline stages' })
  async getDefault(@TenantId() tenantId: string) {
    return this.pipelineService.getDefault(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.pipelineService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pipeline' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.pipelineService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete pipeline' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.pipelineService.delete(tenantId, id);
  }
}
