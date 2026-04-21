import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  controllers: [StockController],
  providers: [StockService, PrismaService],
  exports: [StockService],
})
export class StockModule {}
