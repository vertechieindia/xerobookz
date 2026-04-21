import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppModule as CustomAppModule } from './app/app.module';
import { ModelModule } from './model/model.module';
import { FieldModule } from './field/field.module';
import { ViewModule } from './view/view.module';
import { WorkflowModule } from './workflow/workflow.module';
import { RuleModule } from './rule/rule.module';
import { TemplateModule } from './template/template.module';
import { MenuModule } from './menu/menu.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CustomAppModule,
    ModelModule,
    FieldModule,
    ViewModule,
    WorkflowModule,
    RuleModule,
    TemplateModule,
    MenuModule,
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
