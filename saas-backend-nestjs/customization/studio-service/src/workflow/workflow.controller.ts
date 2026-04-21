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
import { WorkflowService } from './workflow.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('workflows')
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create workflow' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.workflowService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('appId') appId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.workflowService.findAll(tenantId, {
      appId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.workflowService.findOne(tenantId, id);
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute workflow' })
  async execute(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body?: { triggerData?: any },
  ) {
    return this.workflowService.execute(tenantId, id, body?.triggerData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workflow' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.workflowService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete workflow' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.workflowService.delete(tenantId, id);
  }
}
