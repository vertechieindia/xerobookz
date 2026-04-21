import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseService } from './response.service';
import { TenantId } from '@xerobookz/shared-common';
import { Public } from '@xerobookz/shared-auth';

@ApiTags('responses')
@Controller('surveys/:surveyId/responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit survey response (public)' })
  async submit(
    @Query('tenantId') tenantId: string,
    @Param('surveyId') surveyId: string,
    @Body() data: any,
  ) {
    return this.responseService.submit(tenantId, surveyId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all responses for survey' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('surveyId') surveyId: string,
  ) {
    return this.responseService.findAll(tenantId, surveyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get response by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('surveyId') surveyId: string,
    @Param('id') id: string,
  ) {
    return this.responseService.findOne(tenantId, surveyId, id);
  }
}
