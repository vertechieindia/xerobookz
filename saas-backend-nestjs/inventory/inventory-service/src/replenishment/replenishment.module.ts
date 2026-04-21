import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ReplenishmentController } from './replenishment.controller';
import { ReplenishmentService } from './replenishment.service';

@Module({
  controllers: [ReplenishmentController],
  providers: [ReplenishmentService, PrismaService],
  exports: [ReplenishmentService],
})
export class ReplenishmentModule {}
