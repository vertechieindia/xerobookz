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
import { EmailService } from './email.service';
import { TenantId } from '@xerobookz/shared-common';
import { Public } from '@xerobookz/shared-auth';

@ApiTags('emails')
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Get('track/open/:emailId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track email open (public endpoint)' })
  async trackOpen(
    @Query('tenantId') tenantId: string,
    @Param('emailId') emailId: string,
  ) {
    return this.emailService.trackOpen(tenantId, emailId);
  }

  @Public()
  @Get('track/click/:emailId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track email click (public endpoint)' })
  async trackClick(
    @Query('tenantId') tenantId: string,
    @Param('emailId') emailId: string,
    @Query('url') linkUrl: string,
    @Query('ip') ipAddress?: string,
    @Query('ua') userAgent?: string,
  ) {
    return this.emailService.trackClick(tenantId, emailId, linkUrl, {
      ipAddress,
      userAgent,
    });
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get email statistics' })
  async getStats(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.emailService.getEmailStats(tenantId, id);
  }
}
