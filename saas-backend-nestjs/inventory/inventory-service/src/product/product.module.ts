import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductModule {}
