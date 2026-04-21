import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  controllers: [WebsiteController],
  providers: [WebsiteService, PrismaService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
