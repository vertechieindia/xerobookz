import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [AppService],
})
export class AppModule {}
