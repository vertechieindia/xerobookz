import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateWebsiteDto {
  @ApiProperty({ example: 'My Business Website' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'mybusiness.com', required: false })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ example: 'mybusiness', required: false })
  @IsOptional()
  @IsString()
  subdomain?: string;

  @ApiProperty({ example: 'theme-uuid', required: false })
  @IsOptional()
  @IsString()
  themeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  seoSettings?: Record<string, any>;
}
