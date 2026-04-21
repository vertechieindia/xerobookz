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
import { DeviceService } from './device.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register IoT Device' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.deviceService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all IoT Devices' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('boxId') boxId?: string,
    @Query('deviceType') deviceType?: string,
  ) {
    return this.deviceService.findAll(tenantId, { boxId, deviceType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get IoT Device by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.deviceService.findOne(tenantId, id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update device status' })
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.deviceService.updateStatus(tenantId, id, body.status);
  }
}
