import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';

@Module({
  controllers: [RuleController],
  providers: [RuleService, PrismaService],
  exports: [RuleService],
})
export class RuleModule {}
