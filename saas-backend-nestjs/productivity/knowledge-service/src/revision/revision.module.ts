import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { RevisionController } from './revision.controller';
import { RevisionService } from './revision.service';

@Module({
  controllers: [RevisionController],
  providers: [RevisionService, PrismaService],
  exports: [RevisionService],
})
export class RevisionModule {}
