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
import { TicketService } from './ticket.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('tickets')
@Controller('events/:eventId/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create ticket' })
  async create(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Body() data: any,
  ) {
    return this.ticketService.create(tenantId, eventId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets for event' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.ticketService.findAll(tenantId, eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.ticketService.findOne(tenantId, eventId, id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check ticket availability' })
  async checkAvailability(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Query('quantity') quantity?: string,
  ) {
    return this.ticketService.checkAvailability(tenantId, id, quantity ? parseInt(quantity) : 1);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ticket' })
  async update(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.ticketService.update(tenantId, eventId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete ticket' })
  async delete(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.ticketService.delete(tenantId, eventId, id);
  }
}
