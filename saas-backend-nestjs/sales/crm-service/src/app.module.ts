import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LeadModule } from './lead/lead.module';
import { OpportunityModule } from './opportunity/opportunity.module';
import { ContactModule } from './contact/contact.module';
import { ActivityModule } from './activity/activity.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    LeadModule,
    OpportunityModule,
    ContactModule,
    ActivityModule,
    PipelineModule,
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
