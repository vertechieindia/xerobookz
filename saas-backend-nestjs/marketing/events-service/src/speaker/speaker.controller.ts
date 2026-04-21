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
import { SpeakerService } from './speaker.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('speakers')
@Controller('events/:eventId/speakers')
export class SpeakerController {
  constructor(private readonly speakerService: SpeakerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add speaker to event' })
  async create(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Body() data: any,
  ) {
    return this.speakerService.create(tenantId, eventId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all speakers for event' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.speakerService.findAll(tenantId, eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get speaker by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.speakerService.findOne(tenantId, eventId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update speaker' })
  async update(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.speakerService.update(tenantId, eventId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete speaker' })
  async delete(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.speakerService.delete(tenantId, eventId, id);
  }
}
