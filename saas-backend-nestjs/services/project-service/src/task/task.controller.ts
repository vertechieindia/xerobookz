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
import { TaskService } from './task.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('tasks')
@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create task' })
  async create(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Body() data: any,
  ) {
    return this.taskService.create(tenantId, projectId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for project' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Query('stage') stage?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.taskService.findAll(tenantId, projectId, { stage, assignedToId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.taskService.findOne(tenantId, projectId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  async update(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.taskService.update(tenantId, projectId, id, data);
  }

  @Put(':id/stage')
  @ApiOperation({ summary: 'Update task stage' })
  async updateStage(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() body: { stage: string },
  ) {
    return this.taskService.updateStage(tenantId, projectId, id, body.stage);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task' })
  async delete(
    @TenantId() tenantId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.taskService.delete(tenantId, projectId, id);
  }
}
