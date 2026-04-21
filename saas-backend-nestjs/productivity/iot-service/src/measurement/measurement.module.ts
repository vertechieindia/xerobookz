import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { MeasurementController } from './measurement.controller';
import { MeasurementService } from './measurement.service';

@Module({
  controllers: [MeasurementController],
  providers: [MeasurementService, PrismaService],
  exports: [MeasurementService],
})
export class MeasurementModule {}
