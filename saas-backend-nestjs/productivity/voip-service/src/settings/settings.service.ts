import { Injectable } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getOrCreate(tenantId: string, userId: string) {
    let settings = await this.prisma.vOIPUserSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.vOIPUserSettings.create({
        data: {
          tenantId,
          userId,
        },
      });
    }

    return settings;
  }

  async update(tenantId: string, userId: string, data: any) {
    await this.getOrCreate(tenantId, userId);
    return this.prisma.vOIPUserSettings.update({
      where: { userId },
      data: {
        phoneNumber: data.phoneNumber,
        extension: data.extension,
        isAvailable: data.isAvailable,
        doNotDisturb: data.doNotDisturb,
        voicemailEnabled: data.voicemailEnabled,
        voicemailGreeting: data.voicemailGreeting,
      },
    });
  }
}
