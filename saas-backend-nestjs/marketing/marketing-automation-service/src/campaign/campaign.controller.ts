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
import { CampaignService } from './campaign.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new marketing campaign' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.campaignService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: string,
  ) {
    return this.campaignService.findAll(tenantId, { status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.campaignService.findOne(tenantId, id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get campaign statistics' })
  async getStatistics(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.campaignService.getStatistics(
      tenantId,
      id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.campaignService.update(tenantId, id, data);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate campaign' })
  async activate(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.campaignService.activate(tenantId, id);
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause campaign' })
  async pause(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.campaignService.pause(tenantId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete campaign' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.campaignService.delete(tenantId, id);
  }
}
