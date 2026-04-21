import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MeasurementService } from './measurement.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('measurements')
@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record measurement from IoT device' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.measurementService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all measurements' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('operationId') operationId?: string,
    @Query('productId') productId?: string,
    @Query('measurementType') measurementType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.measurementService.findAll(tenantId, {
      operationId,
      productId,
      measurementType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}
