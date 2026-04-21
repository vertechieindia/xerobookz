import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  controllers: [RequestController],
  providers: [RequestService, PrismaService],
  exports: [RequestService],
})
export class RequestModule {}
