import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum AIGenerationType {
  LAYOUT = 'layout',
  CONTENT = 'content',
  IMAGE = 'image',
  SEO = 'seo',
}

export class GenerateContentDto {
  @ApiProperty({ enum: AIGenerationType })
  @IsEnum(AIGenerationType)
  type: AIGenerationType;

  @ApiProperty({ example: 'Create a hero section for a tech startup' })
  @IsString()
  prompt: string;

  @ApiProperty({ example: 'website-uuid', required: false })
  @IsOptional()
  @IsString()
  websiteId?: string;

  @ApiProperty({ example: 'tech startup', required: false })
  @IsOptional()
  @IsString()
  industry?: string;
}
