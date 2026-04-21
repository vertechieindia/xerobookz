import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  async findAll(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Query('isRead') isRead?: string,
  ) {
    return this.notificationService.findAll(tenantId, user.userId, {
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    });
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    const count = await this.notificationService.getUnreadCount(tenantId, user.userId);
    return { count };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.notificationService.markAsRead(tenantId, id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationService.markAllAsRead(tenantId, user.userId);
  }
}
