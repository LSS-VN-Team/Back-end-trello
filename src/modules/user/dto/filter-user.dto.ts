import { ApiProperty } from '@nestjs/swagger';
import { IsEAN, IsEmail, IsOptional } from 'class-validator';

export class UserFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email: string;
}
