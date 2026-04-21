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
import { ListService } from './list.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create mailing list' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.listService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mailing lists' })
  async findAll(@TenantId() tenantId: string) {
    return this.listService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mailing list by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.listService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update mailing list' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.listService.update(tenantId, id, data);
  }

  @Post(':id/subscribers')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add subscriber to list' })
  async addSubscriber(
    @TenantId() tenantId: string,
    @Param('id') listId: string,
    @Body() data: any,
  ) {
    return this.listService.addSubscriber(tenantId, listId, data);
  }

  @Get(':id/subscribers')
  @ApiOperation({ summary: 'Get list subscribers' })
  async getSubscribers(
    @TenantId() tenantId: string,
    @Param('id') listId: string,
    @Query('status') status?: string,
  ) {
    return this.listService.getSubscribers(tenantId, listId, { status });
  }

  @Post(':id/unsubscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe from list' })
  async unsubscribe(
    @TenantId() tenantId: string,
    @Param('id') listId: string,
    @Body() data: { email: string },
  ) {
    return this.listService.unsubscribe(tenantId, listId, data.email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete mailing list' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.listService.delete(tenantId, id);
  }
}
