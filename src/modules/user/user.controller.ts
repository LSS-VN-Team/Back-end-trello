import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Put } from '@nestjs/common/decorators';

@ApiTags('user')
@Controller('user')
export class UserController {
  @InjectModel(User.name)
  private readonly userModel: Model<UserDocument>;
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  @ApiOperation({ summary: 'Get all user' })
  @Get('get')
  async getAll(
    @Query() filter: UpdateUserDto,
    @Pagination() pagination: PaginationOptions,
  ) {
    try {
      const result = await this.userService.getAll(filter, pagination);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(String(id));
  }

  @ApiOperation({ summary: 'Update a user' })
  @Put(':id')
  async updateById(@Param('id') id: string, @Body() data: UpdateUserDto) {
    try {
      const result = await this.userService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete(':id')
  async removeID(@Param('id') id: string) {
    try {
      const result = await this.userService.remove(id);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
