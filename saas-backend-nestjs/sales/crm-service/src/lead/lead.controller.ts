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
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new lead' })
  async create(@TenantId() tenantId: string, @Body() dto: CreateLeadDto) {
    return this.leadService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.leadService.findAll(tenantId, { status, assignedToId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.leadService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateLeadDto>,
  ) {
    return this.leadService.update(tenantId, id, dto);
  }

  @Post(':id/convert')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Convert lead to opportunity' })
  async convertToOpportunity(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() opportunityData: any,
  ) {
    return this.leadService.convertToOpportunity(tenantId, id, opportunityData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete lead' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.leadService.delete(tenantId, id);
  }
}
