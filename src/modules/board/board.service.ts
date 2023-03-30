import {
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Card, CardDocument } from '../card/card.schema';
import { CardService } from '../card/card.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User, UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { Board, BoardDocument } from './board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardFilterDto } from './dto/filter-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>, // @InjectModel(User.name) private userModel: Model<UserDocument>, // private readonly userService: UserService,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private readonly cardService: CardService,
    ) {}

  async findAll(filter: BoardFilterDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};
    if (filter.name) {
      query.email = { $regex: filter.name, $option: 'i' };
    }

    const countDocument = this.boardModel.countDocuments(query);
    const getboard = this.boardModel.find(query).skip(skip).limit(limit);

    const [amount, board] = await Promise.all([countDocument, getboard]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: board,
    };
    // return `This action returns all board`;
  }

  async findOne(id: string) {
    const board = await this.boardModel.findById({ _id: id }).lean();
    if (!board) throw new Error(`board with id is ${id} does not exist`);
    return board;
  }
  async create(data: CreateBoardDto) {
    const user = await this.userModel.findById(data.admin).lean();
    if (!user)
      throw new Error(`Admin ID with id is ${data.admin} does not exist`);
    else {
      const newBoard = new this.boardModel(data);
      newBoard.memberList.push(data.admin);
      const board = await newBoard.save();

      const updateData: string[] = user.boardList;
      updateData.push(newBoard._id.toString());
      const newUser = await this.userModel.findByIdAndUpdate(
        data.admin,
        { boardList: updateData },
        { new: true },
      );
      return board;
    }
  }
  async remove(id: string) {
    const board = await this.boardModel.findById(id).lean();
    if (!board)
      throw new Error(`Project Board with id is ${id} does not exist`);
    else{
      for (let i=0;i<board.memberList.length;i++){
        const member = await this.userModel.findById(board.memberList.at(i)).lean();
        for (let j=0;j<member.boardList.length;j++)
          if( member.boardList.at(i)== id){
            member.boardList.splice(i,1);
            break;
          }
      }
      // for (let i=board.cardList.length-1;i>=0;i--)
      //   this.cardService.remove(board.cardList.at(i), board._id.toString());
    }
    return this.boardModel.findByIdAndDelete(id);
  }

  async update(id: string, data: UpdateBoardDto) {
    const board = await this.boardModel.findById(id).lean();
    if (!board)
      throw new Error(`Project Board with id is ${id} does not exist`);

    const boardInstance = plainToInstance(Board, data);

    removeKeyUndefined(boardInstance);
    return this.boardModel.findByIdAndUpdate(
      id,
      { ...board, ...boardInstance, updatedAt: new Date() },
      { new: true },
    );
  }

  async addMember(idMember: string, idBoard: string) {
    const member = await this.userModel.findById(idMember).lean();
    if (!member)
      throw new Error(`Member with id is ${idMember} does not exist`);
    else {
      const newDataMember: string[] = member.boardList;
      newDataMember.push(idBoard);
      await this.userModel.findByIdAndUpdate(
        idMember,
        { boardList: newDataMember },
        { new: true },
      );
      const board = await this.boardModel.findById(idBoard).lean();
      if (!board)
        throw new Error(`Project Board with id is ${idBoard} does not exist`);
      else {
        await board.memberList.push(idMember);
        await this.boardModel.findByIdAndUpdate(
          idBoard,
          { memberList: board.memberList },
          { new: true },
        );
        return [member, board];
      }
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
        //tìm và xoá idboard của member
        for (let i = 0; i < member.boardList.length; i++) {
          if (member.boardList.at(i) == idBoard) {
            member.boardList.splice(i, 1);
            break;
          }
        }
        await this.userModel.findByIdAndUpdate(
          idMember,
          { boardList: member.boardList },
          { new: true },
        );

        //tìm và xoá idmember của board

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
