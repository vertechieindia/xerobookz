import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new employee' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.employeeService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('departmentId') departmentId?: string,
    @Query('managerId') managerId?: string,
    @Query('status') status?: string,
    @Query('contractType') contractType?: string,
  ) {
    return this.employeeService.findAll(tenantId, {
      departmentId,
      managerId,
      status,
      contractType,
    });
  }

  @Get('org-chart')
  @ApiOperation({ summary: 'Get organizational chart' })
  async getOrgChart(
    @TenantId() tenantId: string,
    @Query('rootEmployeeId') rootEmployeeId?: string,
  ) {
    return this.employeeService.getOrgChart(tenantId, rootEmployeeId);
  }

  @Get('presence-report')
  @ApiOperation({ summary: 'Get presence/attendance report' })
  async getPresenceReport(
    @TenantId() tenantId: string,
    @Query('departmentId') departmentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.employeeService.getPresenceReport(tenantId, {
      departmentId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeeService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update employee' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.employeeService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate employee' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeeService.delete(tenantId, id);
  }
}
