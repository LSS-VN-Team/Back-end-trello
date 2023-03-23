import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { AsyncResource } from 'async_hooks';
import { Model } from 'mongoose';
import { Board, BoardDocument } from './board.schema';
import { BoardDto } from './dtos/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}
  async create(data: BoardDto): Promise<Board> {
    const projectBoard = new this.boardModel(data);
    return projectBoard.save();
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }
}
