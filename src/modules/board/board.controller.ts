import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Body, Controller, Post } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Board, BoardDocument } from './board.schema';
import { BoardService } from './board.service';
import { BoardDto } from './dtos/create-board.dto';

@ApiTags('Project Board')
@Controller('board')
export class BoardController {
  @InjectModel(Board.name)
  private readonly boardModel: Model<BoardDocument>;
  constructor(private readonly boardService: BoardService) {}

  private readonly logger = new Logger(BoardController.name);

  @ApiOperation({ summary: 'Project Board' })
  @Post()
  async create(@Body() data: BoardDto) {
    try {
      const result = await this.boardService.create(data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
