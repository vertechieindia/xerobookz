import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { SpeakerController } from './speaker.controller';
import { SpeakerService } from './speaker.service';

@Module({
  controllers: [SpeakerController],
  providers: [SpeakerService, PrismaService],
  exports: [SpeakerService],
})
export class SpeakerModule {}
