import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  idBoard: string;
}