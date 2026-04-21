import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApprovalService } from './approval.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('approvals')
@Controller('requests/:requestId/approvals')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post('approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve request' })
  async approve(
    @TenantId() tenantId: string,
    @Param('requestId') requestId: string,
    @CurrentUser() user: any,
    @Body() body?: { comment?: string },
  ) {
    return this.approvalService.approve(tenantId, requestId, user.userId, body?.comment);
  }

  @Post('refuse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refuse request' })
  async refuse(
    @TenantId() tenantId: string,
    @Param('requestId') requestId: string,
    @CurrentUser() user: any,
    @Body() body: { reason: string },
  ) {
    return this.approvalService.refuse(tenantId, requestId, user.userId, body.reason);
  }
}
