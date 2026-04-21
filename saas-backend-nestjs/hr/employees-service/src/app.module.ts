import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { SkillModule } from './skill/skill.module';
import { DocumentModule } from './document/document.module';
import { AttendanceModule } from './attendance/attendance.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    EmployeeModule,
    DepartmentModule,
    SkillModule,
    DocumentModule,
    AttendanceModule,
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
