import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Auth } from '@app/core';

export class LoginDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @Auth()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Auth()
  password: string;
}
