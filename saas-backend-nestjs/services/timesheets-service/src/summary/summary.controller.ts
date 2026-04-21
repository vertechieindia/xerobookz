import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SummaryService } from './summary.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('summaries')
@Controller('timesheets/summaries')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update timesheet summary' })
  async createOrUpdate(@TenantId() tenantId: string, @Body() data: any) {
    return this.summaryService.createOrUpdate(tenantId, data.employeeId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timesheet summaries' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('periodType') periodType?: string,
    @Query('status') status?: string,
  ) {
    return this.summaryService.findAll(tenantId, { employeeId, periodType, status });
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit timesheet summary' })
  async submit(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.summaryService.submit(tenantId, id);
  }

  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate timesheet summary' })
  async validate(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.summaryService.validate(tenantId, id, user.userId);
  }
}
