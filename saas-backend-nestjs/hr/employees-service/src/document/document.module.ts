import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, PrismaService],
  exports: [DocumentService],
})
export class DocumentModule {}
