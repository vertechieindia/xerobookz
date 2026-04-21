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
import { QueueService } from './queue.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add call to queue' })
  async addToQueue(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.queueService.addToQueue(tenantId, {
      ...data,
      userId: data.userId || user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get my call queue' })
  async getQueue(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.queueService.getQueue(tenantId, user.userId);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark queue item as completed' })
  async complete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.queueService.complete(tenantId, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel queue item' })
  async cancel(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.queueService.cancel(tenantId, id);
  }
}
