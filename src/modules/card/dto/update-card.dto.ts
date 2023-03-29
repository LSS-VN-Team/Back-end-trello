import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}
