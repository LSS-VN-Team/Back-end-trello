import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CardDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
