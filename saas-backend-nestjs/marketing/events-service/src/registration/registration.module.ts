import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService, PrismaService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
