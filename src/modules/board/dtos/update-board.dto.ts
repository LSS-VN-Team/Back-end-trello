import { PartialType } from '@nestjs/swagger';
import { BoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(BoardDto) {}
