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
import { SessionService } from './session.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('sessions')
@Controller('surveys/:surveyId/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create live survey session' })
  async create(
    @TenantId() tenantId: string,
    @Param('surveyId') surveyId: string,
    @Body() data: any,
  ) {
    return this.sessionService.create(tenantId, surveyId, data);
  }

  @Get('code/:sessionCode')
  @ApiOperation({ summary: 'Get session by code' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('sessionCode') sessionCode: string,
  ) {
    return this.sessionService.findOne(tenantId, sessionCode);
  }

  @Post('code/:sessionCode/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start live session' })
  async start(
    @TenantId() tenantId: string,
    @Param('sessionCode') sessionCode: string,
  ) {
    return this.sessionService.start(tenantId, sessionCode);
  }

  @Post('code/:sessionCode/next')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Move to next question' })
  async nextQuestion(
    @TenantId() tenantId: string,
    @Param('sessionCode') sessionCode: string,
  ) {
    return this.sessionService.nextQuestion(tenantId, sessionCode);
  }

  @Get('code/:sessionCode/results')
  @ApiOperation({ summary: 'Get live results' })
  async getLiveResults(
    @TenantId() tenantId: string,
    @Param('sessionCode') sessionCode: string,
  ) {
    return this.sessionService.getLiveResults(tenantId, sessionCode);
  }
}
