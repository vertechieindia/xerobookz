import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';

@Module({
  controllers: [AutomationController],
  providers: [AutomationService, PrismaService],
  exports: [AutomationService],
})
export class AutomationModule {}
