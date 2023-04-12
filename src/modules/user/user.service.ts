import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ERROR,
  PaginationOptions,
  removeKeyUndefined,
  totalPagination,
} from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { BoardModule } from '../board/board.module';
import { Board, BoardDocument } from '../board/board.schema';
import { async } from 'rxjs';
import { result } from 'lodash';
import moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  // async create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(): Promise<User[]> {
    // return `This action returns all user`;
    throw await this.userModel.find();
  }
  async getAll(filter: UpdateUserDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};

    if (filter.email) {
      query.email = { $regex: filter.email, $options: 'i' };
    }

    const countDocument = this.userModel.countDocuments(query);
    const getUser = this.userModel.find(query).skip(skip).limit(limit);

    const [amount, user] = await Promise.all([countDocument, getUser]);

    return {
      totalPage: totalPagination(amount, limit),
      currentPage: page,
      data: user,
    };
  }
  async findOne(id: string) {
    const user = await this.userModel.findById({ _id: id }).lean();
    if (!user) throw new Error(`User with id is ${id} does not exist`);
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findById({ _id: id }).lean();
    if (!user) throw new Error(`User with id is ${id} does not exist`);

    const userInstance = plainToInstance(User, data);

    removeKeyUndefined(userInstance);

    return this.userModel.findByIdAndUpdate(
      id,
      { ...user, ...userInstance, updatedAt: new Date() },
      { new: true },
    );
  }

  async remove(id: string) {
    const user = await this.userModel.findOne({ _id: id }).lean();
    if (!user) throw new Error(`User with id is ${id} does not exist`);
    return this.userModel.findByIdAndDelete(id);
  }
  // async getGuestWorkSpaces(idUser: string) {
  //   const result: string[] = [];
  //   const user = await this.userModel.findById(idUser).lean();

  //   for (let i = 0; i < user.projectBoardList.length; i++) {
  //     const board = await this.boardModel
  //       .findById(user.projectBoardList.at(i))
  //       .lean();
  //     console.log(board._id.toString());

  //     if (board.admin != idUser) result.push(user.projectBoardList.at(i));
  //   }
  //   return result;
  // }

  // async getRecentlyViewed(idUser: string) {
  //   // const result: string[] = [];
  //   // const user = await this.userModel.findById(idUser).lean();
  //   // if (user.recentlyViewed.length >= 3) {
  //   //   for (
  //   //     let i = user.recentlyViewed.length - 1;
  //   //     i >= user.recentlyViewed.length - 3;
  //   //     i--
  //   //   )
  //   //     result.push(user.recentlyViewed.at(i));
  //   // } else {
  //   //   for (let i = user.recentlyViewed.length - 1; i >= 0; i--)
  //   //     result.push(user.recentlyViewed.at(i));
  //   // }
  //   // return result;
  //   const user = await this.userModel.findById(idUser).lean();
  //   for (let i = 0; i < user.projectBoardList.length; i++) {
  //     const board = await this.boardModel
  //       .findById(user.projectBoardList.at(i))
  //       .lean();
  //     if (board.clickedAt) user.recentlyViewed.push(board._id.toString());
  //   }
  //   for (let i = 0; i < user.recentlyViewed.length - 1; i++)
  //     for (let j = i + 1; j < user.recentlyViewed.length; j++) {
  //       const boardI = await this.boardModel.findById(
  //         user.recentlyViewed.at(i),
  //       );
  //       const boardJ = await this.boardModel.findById(
  //         user.recentlyViewed.at(j),
  //       );

  //       const MMI = moment(boardI.clickedAt);
  //       const MMJ = moment(boardJ.clickedAt);
  //       if (MMI.diff(MMJ, 'second') < 0) {
  //         [user.recentlyViewed[i], user.recentlyViewed[j]] = [
  //           user.recentlyViewed[j],
  //           user.recentlyViewed[i],
  //         ];
  //       }
  //     }
  //   if (user.recentlyViewed.length > 5)
  //     user.recentlyViewed.splice(4, user.recentlyViewed.length - 4);
  //   await this.userModel.findByIdAndUpdate(
  //     idUser,
  //     { recentlyViewed: user.recentlyViewed },
  //     { new: true },
  //   );
  //   return user;
  // }
}
