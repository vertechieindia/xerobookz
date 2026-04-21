import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';

@Module({
  controllers: [BoxController],
  providers: [BoxService, PrismaService],
  exports: [BoxService],
})
export class BoxModule {}
