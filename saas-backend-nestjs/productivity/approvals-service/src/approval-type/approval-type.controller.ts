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
import { ApprovalTypeService } from './approval-type.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('approval-types')
@Controller('approval-types')
export class ApprovalTypeController {
  constructor(private readonly approvalTypeService: ApprovalTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create approval type' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.approvalTypeService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all approval types' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.approvalTypeService.findAll(tenantId, {
      category,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval type by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.approvalTypeService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update approval type' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.approvalTypeService.update(tenantId, id, data);
  }

  @Post(':id/approvers')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add approver to approval type' })
  async addApprover(
    @TenantId() tenantId: string,
    @Param('id') approvalTypeId: string,
    @Body() data: any,
  ) {
    return this.approvalTypeService.addApprover(tenantId, approvalTypeId, data);
  }

  @Delete(':id/approvers/:approverId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove approver from approval type' })
  async removeApprover(
    @TenantId() tenantId: string,
    @Param('id') approvalTypeId: string,
    @Param('approverId') approverId: string,
  ) {
    return this.approvalTypeService.removeApprover(tenantId, approvalTypeId, approverId);
  }
}
