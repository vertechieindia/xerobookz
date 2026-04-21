import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';

@Module({
  controllers: [FieldController],
  providers: [FieldService, PrismaService],
  exports: [FieldService],
})
export class FieldModule {}
