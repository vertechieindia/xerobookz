import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new department' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.departmentService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  async findAll(@TenantId() tenantId: string) {
    return this.departmentService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.departmentService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update department' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.departmentService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate department' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.departmentService.delete(tenantId, id);
  }
}
