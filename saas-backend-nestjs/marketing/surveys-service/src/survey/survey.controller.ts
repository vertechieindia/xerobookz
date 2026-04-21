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
import { SurveyService } from './survey.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('surveys')
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create survey' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.surveyService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all surveys' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.surveyService.findAll(tenantId, { status, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get survey by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.surveyService.findOne(tenantId, id);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get survey analytics' })
  async getAnalytics(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.surveyService.getAnalytics(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update survey' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.surveyService.update(tenantId, id, data);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish survey' })
  async publish(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.surveyService.publish(tenantId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete survey' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.surveyService.delete(tenantId, id);
  }
}
