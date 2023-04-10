import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  url: string;
}
