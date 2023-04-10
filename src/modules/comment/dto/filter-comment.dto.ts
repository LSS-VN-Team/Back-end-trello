import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CommentFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content: string;
}
