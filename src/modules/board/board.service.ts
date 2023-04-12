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
import { Card, CardDocument } from '../card/card.schema';
import { privateDecrypt } from 'crypto';
import { CardModule } from '../card/card.module';
import { CardService } from '../card/card.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private cardService: CardService,
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
  async getProjectBoard(idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    const obj: Board[] = [];
    // console.log('aaaaâ!!');

    for (let i = 0; i < user.projectBoardList.length; i++) {
      const board = await this.boardModel
        .findById(user.projectBoardList.at(i))
        .lean();
      obj.push(board);
    }

    return obj;
  }
  async getrecentlyViewed(idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    const obj: Board[] = [];
    for (let i = 0; i < user.recentlyViewed.length; i++) {
      const board = await this.boardModel
        .findById(user.recentlyViewed.at(i))
        .lean();
      obj.push(board);
    }

    return obj;
  }
  async getguestWorkSpaces(idUser: string) {
    const user = await this.userModel.findById(idUser).lean();
    const obj: Board[] = [];
    for (let i = 0; i < user.guestWorkSpaces.length; i++) {
      const board = await this.boardModel
        .findById(user.guestWorkSpaces.at(i))
        .lean();
      obj.push(board);
    }

    return obj;
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardModel.findById({ _id: id }).lean();
    if (!board) throw new Error(`Board with id is ${id} does not exist`);
    return board;
  }

  async getById(id: string) {
    const board = await this.boardModel.findOne({ _id: id }).lean();
    if (!board) throw new Error(`board with id is ${id} does not exist`);

    return board;
  }

  async addRecentlyViewed(idUser: string, idBoard: string) {
    const user = await this.userModel.findById(idUser).lean();
    user.recentlyViewed.splice(0, 0, idBoard);
    let i = 1;
    while (i < user.recentlyViewed.length) {
      if (user.recentlyViewed.at(i) == idBoard) {
        user.recentlyViewed.splice(i, 1);
      } else i++;
    }

    await this.userModel.findByIdAndUpdate(
      idUser,
      { recentlyViewed: user.recentlyViewed },
      { new: true },
    );
    return user;
  }

  async update(id: string, data: string) {
    const board = await this.boardModel.findById({ _id: id }).lean();
    if (!board) throw new Error(`Board with id is ${id} does not exist`);

    // const userInstance = plainToInstance(Board, data);

    // removeKeyUndefined(userInstance);

    // return this.boardModel.findByIdAndUpdate(
    //   id,
    //   { ...board, ...userInstance, updatedAt: new Date() },
    //   { new: true },
    // );

    return await this.boardModel.findByIdAndUpdate(
      id,
      { name: data },
      { new: true },
    );
  }

  async removeUptoDown(id: string) {
    const board = await this.boardModel.findById(id).lean();
    while (board.cardList.length) {
      this.cardService.removeUpToDown(board.cardList.at(0));
      board.cardList.splice(0, 1);
    }

    return this.boardModel.findByIdAndDelete(id);
  }

  async remove(id: string) {
    const board = await this.boardModel.findById(id).lean();
    if (!board)
      throw new Error(`Project Board with id is ${id} does not exist`);
    else {
      while (board.cardList.length != 0) {
        this.cardService.removeUpToDown(board.cardList.at(0));
        board.cardList.splice(0, 1);
      }
      for (let i = 0; i < board.memberList.length; i++) {
        const member = await this.userModel
          .findById(board.memberList.at(i))
          .lean();
        for (let j = 0; j < member.projectBoardList.length; j++)
          if (member.projectBoardList.at(j) == id) {
            member.projectBoardList.splice(j, 1);
            break;
          }
        for (let j = 0; j < member.recentlyViewed.length; j++)
          if (member.recentlyViewed.at(j) == id) {
            member.recentlyViewed.splice(j, 1);
            break;
          }
        for (let j = 0; j < member.guestWorkSpaces.length; j++)
          if (member.guestWorkSpaces.at(j) == id) {
            member.guestWorkSpaces.splice(j, 1);
            break;
          }
        await this.userModel.findByIdAndUpdate(
          member._id.toString(),
          {
            projectBoardList: member.projectBoardList,
            recentlyViewed: member.recentlyViewed,
            guestWorkSpaces: member.guestWorkSpaces,
          },
          { new: true },
        );
      }
      for (let i = board.cardList.length - 1; i >= 0; i--)
        this.cardService.remove(board.cardList.at(i));
    }
    return this.boardModel.findByIdAndDelete(id);
  }

  async addMember(idMember: string, idBoard: string) {
    const member = await this.userModel.findById(idMember).lean();
    if (!member)
      throw new Error(`Member with id is ${idMember} does not exist`);
    else {
      const newDataMember: string[] = member.guestWorkSpaces;
      newDataMember.push(idBoard);
      await this.userModel.findByIdAndUpdate(
        idMember,
        { guestWorkSpaces: newDataMember },
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
  async moveCard(idCard: string, pos: number) {
    const card = await this.cardModel.findById(idCard).lean();
    const board = await this.boardModel.findById(card.idBoard).lean();
    for (let i = 0; i < board.cardList.length; i++) {
      if (board.cardList.at(i) == idCard) {
        const index = i;

        if (pos < index) {
          board.cardList.splice(pos, 0, idCard);
          board.cardList.splice(index + 1, 1);
        } else {
          board.cardList.splice(pos + 1, 0, idCard);
          board.cardList.splice(index, 1);
        }
        break;
      }
    }
    await this.boardModel.findByIdAndUpdate(
      card.idBoard,
      {
        cardList: board.cardList,
      },
      { new: true },
    );
    return board;
  }
}
