import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventModule } from './event/event.module';
import { TicketModule } from './ticket/ticket.module';
import { RegistrationModule } from './registration/registration.module';
import { SpeakerModule } from './speaker/speaker.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { JwtAuthGuard } from '@xerobookz/shared-auth';
import { TenantGuard } from '@xerobookz/shared-common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    EventModule,
    TicketModule,
    RegistrationModule,
    SpeakerModule,
    SponsorModule,
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
