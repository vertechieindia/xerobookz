import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';

@Module({
  controllers: [ThemeController],
  providers: [ThemeService, PrismaService],
  exports: [ThemeService],
})
export class ThemeModule {}
