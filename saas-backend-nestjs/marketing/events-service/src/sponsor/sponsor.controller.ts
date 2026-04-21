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
import { SponsorService } from './sponsor.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('sponsors')
@Controller('events/:eventId/sponsors')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add sponsor to event' })
  async create(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Body() data: any,
  ) {
    return this.sponsorService.create(tenantId, eventId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sponsors for event' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.sponsorService.findAll(tenantId, eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sponsor by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.sponsorService.findOne(tenantId, eventId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sponsor' })
  async update(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.sponsorService.update(tenantId, eventId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete sponsor' })
  async delete(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.sponsorService.delete(tenantId, eventId, id);
  }
}
