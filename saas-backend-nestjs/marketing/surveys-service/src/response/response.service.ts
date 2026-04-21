import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}

  async submit(tenantId: string, surveyId: string, data: any) {
    // Verify survey exists and is published
    const survey = await this.prisma.survey.findFirst({
      where: { id: surveyId, tenantId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (survey.status !== 'published') {
      throw new Error('Survey is not published');
    }

    return this.prisma.surveyResponse.create({
      data: {
        tenantId,
        surveyId,
        respondentId: data.respondentId,
        respondentType: data.respondentType,
        responses: data.responses || {},
        isAnonymous: data.isAnonymous || false,
        sessionId: data.sessionId,
      },
    });
  }

  async findAll(tenantId: string, surveyId: string) {
    return this.prisma.surveyResponse.findMany({
      where: { tenantId, surveyId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOne(tenantId: string, surveyId: string, id: string) {
    const response = await this.prisma.surveyResponse.findFirst({
      where: { id, surveyId, tenantId },
      include: {
        survey: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    return response;
  }
}
