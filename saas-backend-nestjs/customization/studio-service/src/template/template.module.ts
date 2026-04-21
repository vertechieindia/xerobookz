import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, PrismaService],
  exports: [TemplateService],
})
export class TemplateModule {}
