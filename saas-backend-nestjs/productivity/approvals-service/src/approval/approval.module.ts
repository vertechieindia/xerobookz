import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';

@Module({
  controllers: [ApprovalController],
  providers: [ApprovalService, PrismaService],
  exports: [ApprovalService],
})
export class ApprovalModule {}
