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
import { DocumentService } from './document.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('documents')
@Controller('employees/:employeeId/documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload employee document' })
  async create(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Body() data: any,
  ) {
    return this.documentService.create(tenantId, employeeId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employee documents' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('employeeId') employeeId: string,
    @Query('documentType') documentType?: string,
  ) {
    return this.documentService.findAll(tenantId, employeeId, { documentType });
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get expiring documents' })
  async getExpiring(
    @TenantId() tenantId: string,
    @Query('days') days?: string,
  ) {
    return this.documentService.getExpiringDocuments(tenantId, days ? parseInt(days) : 30);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.documentService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.documentService.update(tenantId, id, data);
  }

  @Put(':id/sign')
  @ApiOperation({ summary: 'Mark document as signed' })
  async markAsSigned(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.documentService.markAsSigned(tenantId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete document' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.documentService.delete(tenantId, id);
  }
}
