import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    const article = await this.prisma.article.create({
      data: {
        tenantId,
        title: data.title,
        content: data.content,
        parentId: data.parentId,
        isPublic: data.isPublic || false,
        isPublished: data.isPublished || false,
        coverImage: data.coverImage,
        tags: data.tags || [],
        customFields: data.customFields || {},
        createdBy: data.createdBy,
      },
    });

    // Add creator as owner
    await this.prisma.articleMember.create({
      data: {
        tenantId,
        articleId: article.id,
        userId: data.createdBy,
        role: 'owner',
        canEdit: true,
        canView: true,
        canDelete: true,
      },
    });

    return this.findOne(tenantId, article.id, data.createdBy);
  }

  async findAll(tenantId: string, userId: string, filters?: {
    parentId?: string;
    isPublic?: boolean;
    isPublished?: boolean;
    search?: string;
  }) {
    // Get articles user has access to
    const memberArticles = await this.prisma.articleMember.findMany({
      where: { tenantId, userId },
      include: {
        article: true,
      },
    });

    const articleIds = memberArticles.map((m) => m.articleId);

    return this.prisma.article.findMany({
      where: {
        tenantId,
        OR: [
          { id: { in: articleIds } },
          { isPublic: true, isPublished: true },
        ],
        ...(filters?.parentId !== undefined && { parentId: filters.parentId }),
        ...(filters?.isPublished !== undefined && { isPublished: filters.isPublished }),
        ...(filters?.search && {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { content: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        _count: {
          select: { children: true, members: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string, userId?: string) {
    const article = await this.prisma.article.findFirst({
      where: { id, tenantId },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            isPublished: true,
          },
        },
        members: {
          take: 20,
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check access
    if (!article.isPublic || !article.isPublished) {
      if (userId) {
        const member = await this.prisma.articleMember.findFirst({
          where: { articleId: id, userId, tenantId },
        });

        if (!member) {
          throw new NotFoundException('Article not found or access denied');
        }
      } else {
        throw new NotFoundException('Article not found or access denied');
      }
    }

    // Increment view count
    await this.prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  async update(tenantId: string, id: string, userId: string, data: any) {
    const article = await this.findOne(tenantId, id, userId);

    // Check edit permission
    const member = await this.prisma.articleMember.findFirst({
      where: { articleId: id, userId, tenantId },
    });

    if (!member || !member.canEdit) {
      throw new Error('No permission to edit this article');
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        isPublic: data.isPublic,
        isPublished: data.isPublished,
        coverImage: data.coverImage,
        tags: data.tags,
        customFields: data.customFields,
        updatedBy: userId,
      },
    });

    // Create revision
    const latestRevision = await this.prisma.articleRevision.findFirst({
      where: { articleId: id },
      orderBy: { revisionNumber: 'desc' },
    });

    await this.prisma.articleRevision.create({
      data: {
        tenantId,
        articleId: id,
        title: article.title,
        content: article.content,
        revisionNumber: (latestRevision?.revisionNumber || 0) + 1,
        createdBy: userId,
      },
    });

    return updated;
  }

  async addMember(tenantId: string, articleId: string, data: any) {
    await this.findOne(tenantId, articleId);
    return this.prisma.articleMember.create({
      data: {
        tenantId,
        articleId,
        userId: data.userId,
        role: data.role || 'viewer',
        canEdit: data.canEdit || false,
        canView: data.canView !== undefined ? data.canView : true,
        canDelete: data.canDelete || false,
      },
    });
  }

  async publish(tenantId: string, id: string, userId: string) {
    await this.findOne(tenantId, id, userId);
    return this.prisma.article.update({
      where: { id },
      data: {
        isPublished: true,
        updatedBy: userId,
      },
    });
  }
}
