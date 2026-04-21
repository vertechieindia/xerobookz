import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';

@Module({
  controllers: [OpportunityController],
  providers: [OpportunityService, PrismaService],
  exports: [OpportunityService],
})
export class OpportunityModule {}
