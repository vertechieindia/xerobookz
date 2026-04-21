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
import { MessageService } from './message.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('messages')
@Controller('channels/:channelId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send message' })
  async create(
    @TenantId() tenantId: string,
    @Param('channelId') channelId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.messageService.create(tenantId, {
      ...data,
      channelId,
      senderId: user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get messages in channel' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('channelId') channelId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.messageService.findAll(tenantId, channelId, {
      limit: limit ? parseInt(limit) : undefined,
      before: before ? new Date(before) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.messageService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit message' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.messageService.update(tenantId, id, body.content);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete message' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.messageService.delete(tenantId, id);
  }

  @Post(':id/reactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add reaction to message' })
  async addReaction(
    @TenantId() tenantId: string,
    @Param('id') messageId: string,
    @CurrentUser() user: any,
    @Body() body: { emoji: string },
  ) {
    return this.messageService.addReaction(tenantId, messageId, {
      userId: user.userId,
      emoji: body.emoji,
    });
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(
    @TenantId() tenantId: string,
    @Param('id') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.messageService.markAsRead(tenantId, messageId, user.userId);
  }
}
