import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('levels')
  @ApiOperation({ summary: 'Get all stock levels' })
  async getAllStockLevels(
    @TenantId() tenantId: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('productId') productId?: string,
  ) {
    return this.stockService.getAllStockLevels(tenantId, { warehouseId, productId });
  }

  @Get('levels/:productId/:warehouseId')
  @ApiOperation({ summary: 'Get stock level for product in warehouse' })
  async getStockLevel(
    @TenantId() tenantId: string,
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.stockService.getStockLevel(tenantId, productId, warehouseId, locationId);
  }

  @Post('movements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create stock movement' })
  async createMovement(@TenantId() tenantId: string, @Body() data: any) {
    return this.stockService.createStockMovement(tenantId, data);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Get stock movements' })
  async getMovements(
    @TenantId() tenantId: string,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.stockService.getStockMovements(tenantId, {
      productId,
      warehouseId,
      type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Post('reserve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reserve stock' })
  async reserveStock(
    @TenantId() tenantId: string,
    @Body() data: { productId: string; warehouseId: string; quantity: number },
  ) {
    return this.stockService.reserveStock(tenantId, data.productId, data.warehouseId, data.quantity);
  }

  @Post('release')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release stock reservation' })
  async releaseReservation(
    @TenantId() tenantId: string,
    @Body() data: { productId: string; warehouseId: string; quantity: number },
  ) {
    return this.stockService.releaseReservation(tenantId, data.productId, data.warehouseId, data.quantity);
  }
}
