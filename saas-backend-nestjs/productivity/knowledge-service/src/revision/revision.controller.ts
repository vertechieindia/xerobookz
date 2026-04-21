import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RevisionService } from './revision.service';
import { TenantId } from '@xerobookz/shared-common';
import { CurrentUser } from '@xerobookz/shared-auth';

@ApiTags('revisions')
@Controller('articles/:articleId/revisions')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all revisions for article' })
  async findAll(
    @TenantId() tenantId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.revisionService.findAll(tenantId, articleId);
  }

  @Get(':revisionNumber')
  @ApiOperation({ summary: 'Get specific revision' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('articleId') articleId: string,
    @Param('revisionNumber') revisionNumber: string,
  ) {
    return this.revisionService.findOne(tenantId, articleId, parseInt(revisionNumber));
  }

  @Post(':revisionNumber/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore article to revision' })
  async restore(
    @TenantId() tenantId: string,
    @Param('articleId') articleId: string,
    @Param('revisionNumber') revisionNumber: string,
    @CurrentUser() user: any,
  ) {
    return this.revisionService.restore(
      tenantId,
      articleId,
      parseInt(revisionNumber),
      user.userId,
    );
  }
}
