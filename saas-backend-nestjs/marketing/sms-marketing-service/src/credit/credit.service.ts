import { Injectable } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class CreditService {
  constructor(private prisma: PrismaService) {}

  async purchaseCredits(tenantId: string, data: { amount: number; cost: number; currency?: string }) {
    return this.prisma.sMSCredit.create({
      data: {
        tenantId,
        amount: data.amount,
        cost: data.cost,
        currency: data.currency || 'USD',
        transactionType: 'purchase',
        description: `Purchased ${data.amount} SMS credits`,
      },
    });
  }

  async getBalance(tenantId: string) {
    const credits = await this.prisma.sMSCredit.findMany({
      where: { tenantId },
    });

    const balance = credits.reduce((sum, credit) => {
      if (credit.transactionType === 'purchase') {
        return sum + Number(credit.amount);
      } else if (credit.transactionType === 'usage') {
        return sum - Number(credit.amount);
      }
      return sum;
    }, 0);

    return {
      balance,
      currency: 'credits',
    };
  }

  async getHistory(tenantId: string) {
    return this.prisma.sMSCredit.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
