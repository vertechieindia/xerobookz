import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService, PrismaService],
  exports: [SummaryService],
})
export class SummaryModule {}
