import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { SponsorController } from './sponsor.controller';
import { SponsorService } from './sponsor.service';

@Module({
  controllers: [SponsorController],
  providers: [SponsorService, PrismaService],
  exports: [SponsorService],
})
export class SponsorModule {}
