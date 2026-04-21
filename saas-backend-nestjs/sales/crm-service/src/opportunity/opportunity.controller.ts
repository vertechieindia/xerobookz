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
import { OpportunityService } from './opportunity.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new opportunity' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.opportunityService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('stage') stage?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.opportunityService.findAll(tenantId, { stage, assignedToId });
  }

  @Get('pipeline')
  @ApiOperation({ summary: 'Get pipeline view' })
  async getPipeline(@TenantId() tenantId: string) {
    return this.opportunityService.getPipeline(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.opportunityService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update opportunity' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.opportunityService.update(tenantId, id, data);
  }

  @Put(':id/stage')
  @ApiOperation({ summary: 'Update opportunity stage' })
  async updateStage(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: { stage: string },
  ) {
    return this.opportunityService.updateStage(tenantId, id, body.stage);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete opportunity' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.opportunityService.delete(tenantId, id);
  }
}
