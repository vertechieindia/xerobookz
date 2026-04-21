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
import { ProjectService } from './project.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create project' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.projectService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.projectService.findAll(tenantId, { status, priority });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.projectService.findOne(tenantId, id);
  }

  @Get(':id/kanban')
  @ApiOperation({ summary: 'Get Kanban view' })
  async getKanban(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.projectService.getKanbanView(tenantId, id);
  }

  @Get(':id/gantt')
  @ApiOperation({ summary: 'Get Gantt view' })
  async getGantt(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.projectService.getGanttView(tenantId, id);
  }

  @Get(':id/profitability')
  @ApiOperation({ summary: 'Get project profitability' })
  async getProfitability(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.projectService.getProfitability(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.projectService.update(tenantId, id, data);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add project member' })
  async addMember(
    @TenantId() tenantId: string,
    @Param('id') projectId: string,
    @Body() data: any,
  ) {
    return this.projectService.addMember(tenantId, projectId, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.projectService.delete(tenantId, id);
  }
}
