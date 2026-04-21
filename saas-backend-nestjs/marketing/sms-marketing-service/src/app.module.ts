import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CampaignModule } from './campaign/campaign.module';
import { MessageModule } from './message/message.module';
import { CreditModule } from './credit/credit.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CampaignModule,
    MessageModule,
    CreditModule,
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
