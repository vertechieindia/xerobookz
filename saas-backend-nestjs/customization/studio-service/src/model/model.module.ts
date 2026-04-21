import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  controllers: [ModelController],
  providers: [ModelService, PrismaService],
  exports: [ModelService],
})
export class ModelModule {}
