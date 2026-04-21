import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

@Module({
  controllers: [OperationController],
  providers: [OperationService, PrismaService],
  exports: [OperationService],
})
export class OperationModule {}
