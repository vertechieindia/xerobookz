import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService, PrismaService],
  exports: [ResponseService],
})
export class ResponseModule {}
