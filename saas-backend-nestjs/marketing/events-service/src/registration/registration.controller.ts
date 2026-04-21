import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('registrations')
@Controller('events/:eventId/registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register for event' })
  async create(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Body() data: any,
  ) {
    return this.registrationService.create(tenantId, eventId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all registrations for event' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Query('status') status?: string,
  ) {
    return this.registrationService.findAll(tenantId, eventId, { status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get registration by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.registrationService.findOne(tenantId, eventId, id);
  }

  @Post(':id/check-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check in attendee' })
  async checkIn(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.registrationService.checkIn(tenantId, eventId, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel registration' })
  async cancel(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.registrationService.cancel(tenantId, eventId, id);
  }

  @Post(':id/confirm-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(
    @TenantId() tenantId: string,
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.registrationService.confirmPayment(tenantId, eventId, id);
  }
}
