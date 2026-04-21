import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  controllers: [QueueController],
  providers: [QueueService, PrismaService],
  exports: [QueueService],
})
export class QueueModule {}
