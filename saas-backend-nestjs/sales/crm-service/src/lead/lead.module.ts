import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [AIModule],
  controllers: [LeadController],
  providers: [LeadService, PrismaService],
  exports: [LeadService],
})
export class LeadModule {}
