import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService],
  exports: [EventService],
})
export class EventModule {}
