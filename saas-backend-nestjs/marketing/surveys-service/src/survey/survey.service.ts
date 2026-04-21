import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.survey.create({
      data: {
        tenantId,
        title: data.title,
        description: data.description,
        category: data.category,
        questions: data.questions || [],
        settings: data.settings || {},
        backgroundImage: data.backgroundImage,
      },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string; category?: string }) {
    return this.prisma.survey.findMany({
      where: {
        tenantId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.category && { category: filters.category }),
      },
      include: {
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const survey = await this.prisma.survey.findFirst({
      where: { id, tenantId },
      include: {
        responses: {
          take: 10,
          orderBy: { submittedAt: 'desc' },
        },
        _count: {
          select: { responses: true, sessions: true },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    return survey;
  }

  async update(tenantId: string, id: string, data: any) {
    await this.findOne(tenantId, id);
    return this.prisma.survey.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        questions: data.questions,
        settings: data.settings,
        status: data.status,
        isLive: data.isLive,
        backgroundImage: data.backgroundImage,
      },
    });
  }

  async publish(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.survey.update({
      where: { id },
      data: { status: 'published' },
    });
  }

  async getAnalytics(tenantId: string, id: string) {
    const survey = await this.findOne(tenantId, id);
    const responses = await this.prisma.surveyResponse.findMany({
      where: { tenantId, surveyId: id },
    });

    // Calculate response rate, completion rate, etc.
    return {
      totalResponses: responses.length,
      completionRate: 100, // Would calculate based on partial responses
      averageTime: 0, // Would calculate from timestamps
      questionStats: this.calculateQuestionStats(survey.questions, responses),
    };
  }

  private calculateQuestionStats(questions: any[], responses: any[]) {
    // Analyze responses per question
    return questions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      responseCount: responses.length,
      // Add more stats based on question type
    }));
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.survey.delete({ where: { id } });
    return { message: 'Survey deleted successfully' };
  }
}
