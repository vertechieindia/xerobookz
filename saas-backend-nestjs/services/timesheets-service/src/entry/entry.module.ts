import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';

@Module({
  controllers: [EntryController],
  providers: [EntryService, PrismaService],
  exports: [EntryService],
})
export class EntryModule {}
