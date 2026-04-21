import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService, PrismaService],
  exports: [TicketService],
})
export class TicketModule {}
