import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ArticleModule } from './article/article.module';
import { RevisionModule } from './revision/revision.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ArticleModule,
    RevisionModule,
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
