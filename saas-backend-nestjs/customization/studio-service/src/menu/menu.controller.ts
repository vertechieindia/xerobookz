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
import { MenuService } from './menu.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create menu item' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.menuService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('appId') appId?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.menuService.findAll(tenantId, { appId, parentId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.menuService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update menu item' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.menuService.update(tenantId, id, data);
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder menu items' })
  async reorder(
    @TenantId() tenantId: string,
    @Body() body: { items: Array<{ id: string; sequence: number }> },
  ) {
    return this.menuService.reorder(tenantId, body.items);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete menu item' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.menuService.delete(tenantId, id);
  }
}
