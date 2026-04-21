import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { MilestoneController } from './milestone.controller';
import { MilestoneService } from './milestone.service';

@Module({
  controllers: [MilestoneController],
  providers: [MilestoneService, PrismaService],
  exports: [MilestoneService],
})
export class MilestoneModule {}
