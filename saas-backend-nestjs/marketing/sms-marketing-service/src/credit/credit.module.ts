import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';

@Module({
  controllers: [CreditController],
  providers: [CreditService, PrismaService],
  exports: [CreditService],
})
export class CreditModule {}
