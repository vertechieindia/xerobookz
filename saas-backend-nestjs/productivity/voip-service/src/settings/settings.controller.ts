import {
  Controller,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get VoIP settings' })
  async getSettings(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.settingsService.getOrCreate(tenantId, user.userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update VoIP settings' })
  async updateSettings(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.settingsService.update(tenantId, user.userId, data);
  }
}
