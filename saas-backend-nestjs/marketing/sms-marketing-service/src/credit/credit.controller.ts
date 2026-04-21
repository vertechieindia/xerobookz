import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreditService } from './credit.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('credits')
@Controller('credits')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Purchase SMS credits' })
  async purchase(@TenantId() tenantId: string, @Body() data: any) {
    return this.creditService.purchaseCredits(tenantId, data);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get credit balance' })
  async getBalance(@TenantId() tenantId: string) {
    return this.creditService.getBalance(tenantId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get credit history' })
  async getHistory(@TenantId() tenantId: string) {
    return this.creditService.getHistory(tenantId);
  }
}
