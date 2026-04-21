import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('models')
@Controller('models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create custom model' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.modelService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all custom models' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('appId') appId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.modelService.findAll(tenantId, {
      appId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom model by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.modelService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update custom model' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.modelService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete custom model' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.modelService.delete(tenantId, id);
  }
}
