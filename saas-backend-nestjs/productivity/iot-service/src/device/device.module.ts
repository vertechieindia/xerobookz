import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService, PrismaService],
  exports: [DeviceService],
})
export class DeviceModule {}
