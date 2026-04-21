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
import { OperationService } from './operation.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('operations')
@Controller('operations')
export class OperationController {
  constructor(private readonly operationService: OperationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Link device to business operation' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.operationService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all device operations' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('deviceId') deviceId?: string,
    @Query('operationType') operationType?: string,
    @Query('linkedToType') linkedToType?: string,
    @Query('linkedToId') linkedToId?: string,
  ) {
    return this.operationService.findAll(tenantId, {
      deviceId,
      operationType,
      linkedToType,
      linkedToId,
    });
  }
}
