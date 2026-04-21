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
import { PickingService } from './picking.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('picking')
@Controller('picking')
export class PickingController {
  constructor(private readonly pickingService: PickingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create picking order' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.pickingService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all picking orders' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ) {
    return this.pickingService.findAll(tenantId, { warehouseId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get picking order by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.pickingService.findOne(tenantId, id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update picking order status' })
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.pickingService.updateStatus(tenantId, id, body.status);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign picking order' })
  async assign(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { assignedToId: string },
  ) {
    return this.pickingService.assign(tenantId, id, body.assignedToId);
  }
}
