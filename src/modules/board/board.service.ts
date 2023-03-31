import {
  Pagination,
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { AsyncResource } from 'async_hooks';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { async } from 'rxjs';
import { User, UserDocument } from '../user/user.schema';
import { Board, BoardDocument } from './board.schema';
import { BoardDto } from './dtos/create-board.dto';
import { FillterBoardDto } from './dtos/fillter-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(data: BoardDto) {
    const user = await this.userModel.findById(data.admin).lean();
    if (!user)
      throw new Error(`AdminID with id is ${data.admin} does not exist`);
    else {
      const newBoard = new this.boardModel(data);
      newBoard.memberList.push(data.admin);
      const board = await newBoard.save();

      const updateData: string[] = user.projectBoardList;
      updateData.push(newBoard._id.toString());
      const newUser = await this.userModel.findByIdAndUpdate(
        data.admin,
        { projectBoardList: updateData },
        { new: true },
      );
      return newBoard;
    }
  }

  async getAll(filter: FillterBoardDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};

    if (filter.admin) {
      query.admin = { $regex: filter.admin, $options: 'i' };
    }

    const countDocument = this.boardModel.countDocuments(query);
    const getBoard = this.boardModel.find(query).skip(skip).limit(limit);

    const [amount, Board] = await Promise.all([countDocument, getBoard]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: Board,
    };
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async findOne(id: string): Promise<Board> {
    return this.boardModel.findById(id).exec();
  }
  async getById(id: string) {
    const board = await this.boardModel.findOne({ _id: id }).lean();
    if (!board) throw new Error(`board with id is ${id} does not exist`);
    return board;
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

  async addMember(idMember: string, idBoard: string) {
    const member = await this.userModel.findById(idMember).lean();
    if (!member)
      throw new Error(`Member with id is ${idMember} does not exist`);
    else {
      const newDataMember: string[] = member.projectBoardList;
      newDataMember.push(idBoard);
      await this.userModel.findByIdAndUpdate(
        idMember,
        { boardList: newDataMember },
        { new: true },
      );
      const board = await this.boardModel.findById(idBoard).lean();
      await board.memberList.push(idMember);
      await this.boardModel.findByIdAndUpdate(
        idBoard,
        { memberList: board.memberList },
        { new: true },
      );
      return true;
    }
  }

  async removeMember(idMember: string, idBoard: string) {
    const member = await this.userModel.findById(idMember).lean();
    if (!member)
      throw new Error(`Member with id is ${idMember} does not exist`);
    else {
      const board = await this.boardModel.findById(idBoard).lean();
      if (!board)
        throw new Error(`Project Board with id is ${idBoard} does not exist`);
      else {
        for (let i = 0; i < member.projectBoardList.length; i++) {
          if (member.projectBoardList.at(i) == idBoard) {
            member.projectBoardList.splice(i, 1);
            break;
          }
        }
        await this.userModel.findByIdAndUpdate(
          idMember,
          { boardList: member.projectBoardList },
          { new: true },
        );
        for (let i = 0; i < board.memberList.length; i++) {
          if (board.memberList.at(i) == idMember) {
            board.memberList.splice(i, 1);
            break;
          }
        }
        await this.boardModel.findByIdAndUpdate(
          idBoard,
          { memberList: board.memberList },
          { new: true },
        );
        return [member, board];
      }
    }
  }
}
