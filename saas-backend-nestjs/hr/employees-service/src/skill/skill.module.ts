import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
  controllers: [SkillController],
  providers: [SkillService, PrismaService],
  exports: [SkillService],
})
export class SkillModule {}
