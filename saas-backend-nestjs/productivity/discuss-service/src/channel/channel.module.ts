import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
