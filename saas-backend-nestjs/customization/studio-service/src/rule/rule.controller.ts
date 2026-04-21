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
import { RuleService } from './rule.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('rules')
@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create business rule' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.ruleService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business rules' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('appId') appId?: string,
    @Query('model') model?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.ruleService.findAll(tenantId, {
      appId,
      model,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business rule by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.ruleService.findOne(tenantId, id);
  }

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate business rules for a record' })
  async evaluate(
    @TenantId() tenantId: string,
    @Body() body: { model: string; recordData: any },
  ) {
    return this.ruleService.evaluate(tenantId, body.model, body.recordData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update business rule' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.ruleService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete business rule' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.ruleService.delete(tenantId, id);
  }
}
