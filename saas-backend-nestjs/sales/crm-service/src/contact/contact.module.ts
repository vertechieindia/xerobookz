import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService],
  exports: [ContactService],
})
export class ContactModule {}
