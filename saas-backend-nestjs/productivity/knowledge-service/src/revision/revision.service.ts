import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class RevisionService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, articleId: string) {
    return this.prisma.articleRevision.findMany({
      where: { tenantId, articleId },
      orderBy: { revisionNumber: 'desc' },
    });
  }

  async findOne(tenantId: string, articleId: string, revisionNumber: number) {
    const revision = await this.prisma.articleRevision.findFirst({
      where: {
        tenantId,
        articleId,
        revisionNumber,
      },
    });

    if (!revision) {
      throw new NotFoundException('Revision not found');
    }

    return revision;
  }

  async restore(tenantId: string, articleId: string, revisionNumber: number, userId: string) {
    const revision = await this.findOne(tenantId, articleId, revisionNumber);

    // Update article with revision content
    await this.prisma.article.update({
      where: { id: articleId },
      data: {
        title: revision.title,
        content: revision.content,
        updatedBy: userId,
      },
    });

    // Create new revision
    const latestRevision = await this.prisma.articleRevision.findFirst({
      where: { articleId },
      orderBy: { revisionNumber: 'desc' },
    });

    await this.prisma.articleRevision.create({
      data: {
        tenantId,
        articleId,
        title: revision.title,
        content: revision.content,
        revisionNumber: (latestRevision?.revisionNumber || 0) + 1,
        createdBy: userId,
      },
    });

    return { message: 'Revision restored successfully' };
  }
}
