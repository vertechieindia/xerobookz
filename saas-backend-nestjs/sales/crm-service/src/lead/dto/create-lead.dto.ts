import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsArray, IsInt, Min, Max } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 'CEO', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'website', required: false })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example: ['hot', 'enterprise'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'user-uuid', required: false })
  @IsOptional()
  @IsString()
  assignedToId?: string;
}
