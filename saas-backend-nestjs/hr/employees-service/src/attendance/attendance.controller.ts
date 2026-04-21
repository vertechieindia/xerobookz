import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in/:employeeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Employee check-in' })
  async checkIn(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Body() data: { location?: string },
  ) {
    return this.attendanceService.checkIn(tenantId, employeeId, data);
  }

  @Put('check-out/:employeeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Employee check-out' })
  async checkOut(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Body() data: { location?: string; notes?: string },
  ) {
    return this.attendanceService.checkOut(tenantId, employeeId, data);
  }

  @Get('records')
  @ApiOperation({ summary: 'Get attendance records' })
  async getRecords(
    @TenantId() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getRecords(tenantId, {
      employeeId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('employees/:employeeId')
  @ApiOperation({ summary: 'Get employee attendance' })
  async getEmployeeAttendance(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getEmployeeAttendance(
      tenantId,
      employeeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
