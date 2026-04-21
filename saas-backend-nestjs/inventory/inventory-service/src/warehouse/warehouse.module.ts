import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, PrismaService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
