import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ApprovalTypeController } from './approval-type.controller';
import { ApprovalTypeService } from './approval-type.service';

@Module({
  controllers: [ApprovalTypeController],
  providers: [ApprovalTypeService, PrismaService],
  exports: [ApprovalTypeService],
})
export class ApprovalTypeModule {}
