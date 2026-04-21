import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate content using AI' })
  async generate(
    @TenantId() tenantId: string,
    @Body() dto: GenerateContentDto,
  ) {
    return this.aiService.generateContent(tenantId, dto);
  }

  @Post('suggest-layout')
  @ApiOperation({ summary: 'Suggest website layout based on industry' })
  async suggestLayout(
    @Body() body: { industry: string; businessType: string },
  ) {
    return this.aiService.suggestLayout(body.industry, body.businessType);
  }
}
