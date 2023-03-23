import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsNumber, IsString } from 'class-validator';
// import { IsOptional } from 'class-validator';
// import { IsNumber, IsString } from ;

export class CreateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  projectBoardList: string[];
}
