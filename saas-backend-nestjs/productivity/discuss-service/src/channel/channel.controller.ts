import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create channel' })
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.channelService.create(tenantId, {
      ...data,
      createdBy: user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all channels for user' })
  async findAll(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.channelService.findAll(tenantId, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get channel by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.channelService.findOne(tenantId, id);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add member to channel' })
  async addMember(
    @TenantId() tenantId: string,
    @Param('id') channelId: string,
    @Body() data: any,
  ) {
    return this.channelService.addMember(tenantId, channelId, data);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove member from channel' })
  async removeMember(
    @TenantId() tenantId: string,
    @Param('id') channelId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelService.removeMember(tenantId, channelId, userId);
  }

  @Put(':id/archive')
  @ApiOperation({ summary: 'Archive channel' })
  async archive(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.channelService.archive(tenantId, id);
  }
}
