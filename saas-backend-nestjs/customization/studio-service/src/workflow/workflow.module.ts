import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';

@Module({
  controllers: [WorkflowController],
  providers: [WorkflowService, PrismaService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
