import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EntryService } from './entry.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('entries')
@Controller('timesheets/entries')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create timesheet entry' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.entryService.create(tenantId, data);
  }

  @Post('timer/start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start timer' })
  async startTimer(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.entryService.startTimer(tenantId, {
      ...data,
      employeeId: data.employeeId || user.userId,
    });
  }

  @Post('timer/:id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop timer' })
  async stopTimer(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.entryService.stopTimer(tenantId, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timesheet entries' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('projectId') projectId?: string,
    @Query('taskId') taskId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    return this.entryService.findAll(tenantId, {
      employeeId,
      projectId,
      taskId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status,
    });
  }

  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate timesheet entry' })
  async validate(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.entryService.validate(tenantId, id, user.userId);
  }

  @Get('billable')
  @ApiOperation({ summary: 'Get billable time' })
  async getBillableTime(
    @TenantId() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('projectId') projectId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.entryService.getBillableTime(tenantId, {
      employeeId,
      projectId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}
