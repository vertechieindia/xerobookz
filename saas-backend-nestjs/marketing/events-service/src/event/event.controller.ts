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
import { EventService } from './event.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create event' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.eventService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: string,
    @Query('eventType') eventType?: string,
  ) {
    return this.eventService.findAll(tenantId, { status, eventType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.eventService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.eventService.update(tenantId, id, data);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish event' })
  async publish(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.eventService.publish(tenantId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete event' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.eventService.delete(tenantId, id);
  }
}
