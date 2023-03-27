import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BoardDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  admin: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cardList: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  memberList: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  imgSource: string[];
}
