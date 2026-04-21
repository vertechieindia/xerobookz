import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BoxService } from './box.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('boxes')
@Controller('boxes')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register IoT Box' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.boxService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all IoT Boxes' })
  async findAll(@TenantId() tenantId: string) {
    return this.boxService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get IoT Box by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.boxService.findOne(tenantId, id);
  }

  @Put(':serialNumber/heartbeat')
  @ApiOperation({ summary: 'Update IoT Box status (heartbeat)' })
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('serialNumber') serialNumber: string,
    @Body() body: { status: string; ipAddress?: string },
  ) {
    return this.boxService.updateStatus(tenantId, serialNumber, body.status, body.ipAddress);
  }
}
