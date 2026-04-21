import { Module } from '@nestjs/common';
import { PrismaService } from '@xerobookz/shared-database';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService],
  exports: [ArticleService],
})
export class ArticleModule {}
