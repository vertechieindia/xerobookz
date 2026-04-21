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
import { ActivityService } from './activity.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new activity' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.activityService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('leadId') leadId?: string,
    @Query('opportunityId') opportunityId?: string,
  ) {
    return this.activityService.findAll(tenantId, { type, status, leadId, opportunityId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.activityService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update activity' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.activityService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete activity' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.activityService.delete(tenantId, id);
  }
}
