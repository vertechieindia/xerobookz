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
import { MilestoneService } from './milestone.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('milestones')
@Controller('projects/:projectId/milestones')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create milestone' })
  async create(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
  ) {
    return this.milestoneService.create(tenantId, projectId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all milestones for project' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.milestoneService.findAll(tenantId, projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get milestone by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.milestoneService.findOne(tenantId, projectId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update milestone' })
  async update(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.milestoneService.update(tenantId, projectId, id, data);
  }

  @Post(':id/achieve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark milestone as achieved' })
  async markAchieved(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.milestoneService.markAchieved(tenantId, projectId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete milestone' })
  async delete(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.milestoneService.delete(tenantId, projectId, id);
  }
}
