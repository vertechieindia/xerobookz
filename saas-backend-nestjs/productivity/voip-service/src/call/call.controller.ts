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
import { CallService } from './call.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('calls')
@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate VoIP call' })
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.callService.create(tenantId, {
      ...data,
      callerId: user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all calls' })
  async findAll(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Query('direction') direction?: string,
    @Query('status') status?: string,
    @Query('linkedToType') linkedToType?: string,
    @Query('linkedToId') linkedToId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.callService.findAll(tenantId, {
      userId: user.userId,
      direction,
      status,
      linkedToType,
      linkedToId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get call by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.callService.findOne(tenantId, id);
  }

  @Post(':id/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Answer call' })
  async answer(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.callService.answer(tenantId, id);
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End call' })
  async end(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body?: { notes?: string },
  ) {
    return this.callService.end(tenantId, id, body?.notes);
  }

  @Put(':id/link')
  @ApiOperation({ summary: 'Link call to record (CRM, Sales, Helpdesk)' })
  async linkToRecord(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { linkedToType: string; linkedToId: string },
  ) {
    return this.callService.linkToRecord(tenantId, id, body.linkedToType, body.linkedToId);
  }
}
