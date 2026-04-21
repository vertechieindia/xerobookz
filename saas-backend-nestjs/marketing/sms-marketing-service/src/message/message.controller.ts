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
import { MessageService } from './message.service';
import { TenantId } from '@xerobookz/shared-common';
import { Public } from '@xerobookz/shared-auth';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send SMS message' })
  async sendMessage(@TenantId() tenantId: string, @Body() data: any) {
    return this.messageService.sendMessage(tenantId, data);
  }

  @Public()
  @Get('track/click/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track SMS click (public endpoint)' })
  async trackClick(
    @Query('tenantId') tenantId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.trackClick(tenantId, messageId);
  }
}
