import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR, PaginationOptions, removeKeyUndefined, totalPagination } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UserModule } from './user.module';
import { UserFilterDto } from './dto/filter-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}


  async findAll(filter: UserFilterDto, pagination: PaginationOptions) {
    const { limit, page, skip } = pagination;
    const query: any = {};
    if (filter.email){
      query.email = {$regex: filter.email, $option : 'i'};
    }

    const  countDocument = this.userModel.countDocuments(query);
    const getUser = this.userModel.find(query).skip(skip).limit(limit);

    const [amount,user] = await Promise.all([countDocument, getUser]);

    return{
      totalPage : totalPagination(amount,limit),
      currentPage: page,
      data: user
    }
    // return `This action returns all user`;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById({_id: id}).lean(); 
    if (!user) throw new Error(`User with id is ${id} does not exist`);
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findById(id).lean();
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
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new Error(`User with id is ${id} does not exist`);
    return this.userModel.findByIdAndDelete(id);
  }

  async addBoard(idUser: string,idBoard: string){
    const user = await this.userModel.findById(idUser).lean();
    if (!user) throw new Error(`User with id is ${idUser} does not exist`);
    return user.boardList.push(idBoard);
  }
}
