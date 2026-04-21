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
import { RequestService } from './request.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('requests')
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create approval request' })
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.requestService.create(tenantId, {
      ...data,
      requesterId: user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all approval requests' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('requesterId') requesterId?: string,
    @Query('status') status?: string,
    @Query('approvalTypeId') approvalTypeId?: string,
  ) {
    return this.requestService.findAll(tenantId, {
      requesterId,
      status,
      approvalTypeId,
    });
  }

  @Get('my-pending')
  @ApiOperation({ summary: 'Get my pending approvals' })
  async getMyPendingApprovals(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.requestService.getMyPendingApprovals(tenantId, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval request by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.requestService.findOne(tenantId, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel approval request' })
  async cancel(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.requestService.cancel(tenantId, id, user.userId);
  }
}
