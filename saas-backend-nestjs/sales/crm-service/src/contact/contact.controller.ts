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
import { ContactService } from './contact.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new contact' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.contactService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  async findAll(@TenantId() tenantId: string) {
    return this.contactService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.contactService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.contactService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete contact' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.contactService.delete(tenantId, id);
  }
}
