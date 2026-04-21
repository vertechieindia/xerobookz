import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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

  @Post('campaigns/:campaignId/contacts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add contact to campaign workflow' })
  async addContact(
    @TenantId() tenantId: string,
    @Param('campaignId') campaignId: string,
    @Body() data: { contactId: string; contactType: string },
  ) {
    return this.workflowService.addContactToCampaign(
      tenantId,
      campaignId,
      data.contactId,
      data.contactType,
    );
  }

  @Post('activities/:activityId/events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process workflow event' })
  async processEvent(
    @TenantId() tenantId: string,
    @Param('activityId') activityId: string,
    @Body() data: { eventType: string; eventData?: any },
  ) {
    return this.workflowService.processEvent(
      tenantId,
      activityId,
      data.eventType,
      data.eventData,
    );
  }

  @Get('activities/:activityId')
  @ApiOperation({ summary: 'Get activity status' })
  async getActivityStatus(
    @TenantId() tenantId: string,
    @Param('activityId') activityId: string,
  ) {
    return this.workflowService.getActivityStatus(tenantId, activityId);
  }
}
