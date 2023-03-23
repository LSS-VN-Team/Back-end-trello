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

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
}
