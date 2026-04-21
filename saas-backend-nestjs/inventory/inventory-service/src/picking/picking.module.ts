import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { PickingController } from './picking.controller';
import { PickingService } from './picking.service';

@Module({
  controllers: [PickingController],
  providers: [PickingService, PrismaService],
  exports: [PickingService],
})
export class PickingModule {}
