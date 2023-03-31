import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
// import { Task } from 'src/modules/task/task.schema';
import { Card } from '../card.schema';

export class UpdateCardDto extends PartialType(Card) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;
}
