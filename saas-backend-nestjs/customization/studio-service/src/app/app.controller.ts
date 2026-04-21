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
import { AppService } from './app.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('apps')
@Controller('apps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create custom app' })
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.appService.create(tenantId, {
      ...data,
      createdBy: user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all custom apps' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.appService.findAll(tenantId, {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom app by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.appService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update custom app' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.appService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete custom app' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.appService.delete(tenantId, id);
  }
}
