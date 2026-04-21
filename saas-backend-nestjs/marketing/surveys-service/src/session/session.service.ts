import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, surveyId: string, data: any) {
    // Generate unique session code
    const sessionCode = this.generateSessionCode();

    return this.prisma.surveySession.create({
      data: {
        tenantId,
        surveyId,
        sessionCode,
        hostId: data.hostId,
        settings: data.settings || {},
      },
    });
  }

  async findOne(tenantId: string, sessionCode: string) {
    const session = await this.prisma.surveySession.findUnique({
      where: { sessionCode },
      include: {
        survey: true,
        responses: {
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!session || session.tenantId !== tenantId) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async start(tenantId: string, sessionCode: string) {
    const session = await this.findOne(tenantId, sessionCode);
    return this.prisma.surveySession.update({
      where: { sessionCode },
      data: {
        status: 'active',
        startedAt: new Date(),
      },
    });
  }

  async nextQuestion(tenantId: string, sessionCode: string) {
    const session = await this.findOne(tenantId, sessionCode);
    const survey = session.survey as any;
    const questions = survey.questions || [];

    const nextQuestionIndex = (session.currentQuestion || 0) + 1;

    if (nextQuestionIndex >= questions.length) {
      // Complete session
      return this.prisma.surveySession.update({
        where: { sessionCode },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });
    }

    return this.prisma.surveySession.update({
      where: { sessionCode },
      data: { currentQuestion: nextQuestionIndex },
    });
  }

  async getLiveResults(tenantId: string, sessionCode: string) {
    const session = await this.findOne(tenantId, sessionCode);
    const survey = session.survey as any;
    const currentQuestion = survey.questions?.[session.currentQuestion || 0];

    // Get responses for current question
    const responses = session.responses.filter((r: any) => {
      const responseData = r.responses as any;
      return responseData[currentQuestion?.id];
    });

    // Calculate results
    return {
      question: currentQuestion,
      totalResponses: responses.length,
      results: this.calculateResults(currentQuestion, responses),
    };
  }

  private calculateResults(question: any, responses: any[]) {
    // Calculate results based on question type
    if (question.type === 'multiple_choice' || question.type === 'single_choice') {
      const counts: Record<string, number> = {};
      responses.forEach((r) => {
        const answer = (r.responses as any)[question.id];
        counts[answer] = (counts[answer] || 0) + 1;
      });
      return counts;
    }
    return {};
  }

  private generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
