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
import { AutomationService } from './automation.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('automation')
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create automation rule' })
  async createRule(@TenantId() tenantId: string, @Body() data: any) {
    return this.automationService.createRule(tenantId, data);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all automation rules' })
  async findAllRules(
    @TenantId() tenantId: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.automationService.findAllRules(tenantId, {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get automation rule by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.automationService.findOne(tenantId, id);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update automation rule' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.automationService.update(tenantId, id, data);
  }

  @Post('rules/:id/toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle automation rule' })
  async toggle(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.automationService.toggle(tenantId, id);
  }

  @Post('rules/:id/evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate automation rule' })
  async evaluate(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() eventData: any,
  ) {
    return this.automationService.evaluateRule(tenantId, id, eventData);
  }

  @Delete('rules/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete automation rule' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.automationService.delete(tenantId, id);
  }
}
