import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create article' })
  async create(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.articleService.create(tenantId, {
      ...data,
      createdBy: user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  async findAll(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Query('parentId') parentId?: string,
    @Query('isPublic') isPublic?: string,
    @Query('isPublished') isPublished?: string,
    @Query('search') search?: string,
  ) {
    return this.articleService.findAll(tenantId, user.userId, {
      parentId,
      isPublic: isPublic === 'true' ? true : undefined,
      isPublished: isPublished === 'true' ? true : undefined,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user?: any,
  ) {
    return this.articleService.findOne(tenantId, id, user?.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update article' })
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.articleService.update(tenantId, id, user.userId, data);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add member to article' })
  async addMember(
    @TenantId() tenantId: string,
    @Param('id') articleId: string,
    @Body() data: any,
  ) {
    return this.articleService.addMember(tenantId, articleId, data);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish article' })
  async publish(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.articleService.publish(tenantId, id, user.userId);
  }
}
