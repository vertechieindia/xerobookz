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
import { WarehouseService } from './warehouse.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new warehouse' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.warehouseService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  async findAll(@TenantId() tenantId: string) {
    return this.warehouseService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.warehouseService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.warehouseService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete warehouse' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.warehouseService.delete(tenantId, id);
  }

  @Post(':id/locations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create location in warehouse' })
  async createLocation(
    @TenantId() tenantId: string,
    @Param('id') warehouseId: string,
    @Body() data: any,
  ) {
    return this.warehouseService.createLocation(tenantId, warehouseId, data);
  }

  @Get(':id/locations')
  @ApiOperation({ summary: 'Get all locations in warehouse' })
  async getLocations(
    @TenantId() tenantId: string,
    @Param('id') warehouseId: string,
  ) {
    return this.warehouseService.getLocations(tenantId, warehouseId);
  }
}
