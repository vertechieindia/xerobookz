import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { StockModule } from './stock/stock.module';
import { PickingModule } from './picking/picking.module';
import { ReplenishmentModule } from './replenishment/replenishment.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ProductModule,
    WarehouseModule,
    StockModule,
    PickingModule,
    ReplenishmentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
