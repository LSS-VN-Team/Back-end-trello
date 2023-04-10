import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FillterBoardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  admin: string;
}
