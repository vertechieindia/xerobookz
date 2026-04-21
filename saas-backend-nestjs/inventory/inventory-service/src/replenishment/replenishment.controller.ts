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
import { ReplenishmentService } from './replenishment.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('replenishment')
@Controller('replenishment')
export class ReplenishmentController {
  constructor(private readonly replenishmentService: ReplenishmentService) {}

  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create replenishment rule' })
  async createRule(@TenantId() tenantId: string, @Body() data: any) {
    return this.replenishmentService.createRule(tenantId, data);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all replenishment rules' })
  async findAllRules(
    @TenantId() tenantId: string,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.replenishmentService.findAllRules(tenantId, { productId, warehouseId });
  }

  @Get('check/:productId/:warehouseId')
  @ApiOperation({ summary: 'Check if product needs replenishment' })
  async checkReplenishment(
    @TenantId() tenantId: string,
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.replenishmentService.checkReplenishment(tenantId, productId, warehouseId);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get replenishment suggestions' })
  async getSuggestions(
    @TenantId() tenantId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.replenishmentService.getReplenishmentSuggestions(tenantId, warehouseId);
  }
}
