import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ example: 'Home Page' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'home' })
  @IsString()
  slug: string;

  @ApiProperty({ example: '/' })
  @IsString()
  path: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiProperty({ description: 'Page content (blocks, layout)' })
  @IsObject()
  content: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
