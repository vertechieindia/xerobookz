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
import { CallService } from './call.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('calls')
@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post('video')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start video call' })
  async createVideoCall(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.callService.createVideoCall(tenantId, {
      ...data,
      initiatorId: user.userId,
    });
  }

  @Post('video/:id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End video call' })
  async endVideoCall(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.callService.endVideoCall(tenantId, id);
  }

  @Post('voice')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start voice call' })
  async createVoiceCall(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.callService.createVoiceCall(tenantId, {
      ...data,
      callerId: user.userId,
    });
  }

  @Post('voice/:id/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Answer voice call' })
  async answerVoiceCall(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.callService.answerVoiceCall(tenantId, id);
  }

  @Post('voice/:id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End voice call' })
  async endVoiceCall(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.callService.endVoiceCall(tenantId, id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get call history' })
  async getCallHistory(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Query('type') type?: string,
  ) {
    return this.callService.getCallHistory(tenantId, user.userId, type);
  }
}
