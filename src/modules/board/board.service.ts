import { removeKeyUndefined } from '@app/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { AsyncResource } from 'async_hooks';
import { plainToInstance } from 'class-transformer';
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

  async findOne(id: string): Promise<Board> {
    return this.boardModel.findById(id).exec();
  }

  async update(id: string, data: BoardDto) {
    const board = await this.boardModel.findById({ _id: id }).lean();
    if (!board) throw new Error(`Board with id is ${id} does not exist`);

    const userInstance = plainToInstance(Board, data);

    removeKeyUndefined(userInstance);

    return this.boardModel.findByIdAndUpdate(
      id,
      { ...board, ...userInstance, updatedAt: new Date() },
      { new: true },
    );
  }

  async remove(id: string) {
    const board = await this.boardModel.findOne({ _id: id }).lean();
    if (!board) throw new Error(`Board with id is ${id} does not exist`);
    return this.boardModel.findByIdAndDelete(id);
  }
}
