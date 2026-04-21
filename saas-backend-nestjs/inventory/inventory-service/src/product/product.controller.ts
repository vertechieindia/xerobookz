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
import { ProductService } from './product.service';
import { TenantId } from '@xerobookz/shared-common';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  async create(@TenantId() tenantId: string, @Body() data: any) {
    return this.productService.create(tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.productService.findAll(tenantId, {
      category,
      type,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Find product by barcode' })
  async findByBarcode(@TenantId() tenantId: string, @Param('barcode') barcode: string) {
    return this.productService.findByBarcode(tenantId, barcode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productService.findOne(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.productService.update(tenantId, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product' })
  async delete(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.productService.delete(tenantId, id);
  }
}
