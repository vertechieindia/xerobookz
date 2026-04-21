import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
