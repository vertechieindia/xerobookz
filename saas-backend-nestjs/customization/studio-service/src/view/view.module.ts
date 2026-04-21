import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  controllers: [ViewController],
  providers: [ViewService, PrismaService],
  exports: [ViewService],
})
export class ViewModule {}
