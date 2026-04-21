import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService],
  exports: [MenuService],
})
export class MenuModule {}
