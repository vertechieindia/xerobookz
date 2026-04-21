import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService, PrismaService],
  exports: [SessionService],
})
export class SessionModule {}
