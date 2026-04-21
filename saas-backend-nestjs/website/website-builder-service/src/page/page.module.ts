import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  controllers: [PageController],
  providers: [PageService, PrismaService],
  exports: [PageService],
})
export class PageModule {}
