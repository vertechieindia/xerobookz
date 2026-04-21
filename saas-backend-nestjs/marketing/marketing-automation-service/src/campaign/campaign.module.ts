import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService, PrismaService],
  exports: [CampaignService],
})
export class CampaignModule {}
