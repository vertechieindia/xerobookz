import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';

@Module({
  controllers: [PipelineController],
  providers: [PipelineService, PrismaService],
  exports: [PipelineService],
})
export class PipelineModule {}
