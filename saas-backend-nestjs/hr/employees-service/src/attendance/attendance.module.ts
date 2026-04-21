import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, PrismaService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
