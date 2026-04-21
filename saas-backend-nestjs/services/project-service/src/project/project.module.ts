import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService],
  exports: [ProjectService],
})
export class ProjectModule {}
