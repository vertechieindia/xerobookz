import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  controllers: [ListController],
  providers: [ListService, PrismaService],
  exports: [ListService],
})
export class ListModule {}
