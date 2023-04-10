import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  Req,
  Request,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserFilterDto } from './dto/filter-user.dto';
import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Auth, CurrentUser } from '@app/core';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @ApiOperation({ summary: 'Find all user' })
  @Get()
  async getAll(
    @Query() filter: UserFilterDto,
    @Pagination() Pagination: PaginationOptions,
  ) {
    try {
      const result = await this.userService.getAll(filter, Pagination);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  // @ApiOperation({ summary: 'Find one user' })
  // @Auth()
  // @Get('profile')
  // async getOne(@CurrentUser('id') id: string) {
  //   try {
  //     const result = await this.userService.findOne(id);
  //     return responseSuccess(result);
  //   } catch (error) {
  //     this.logger.error(error.stack);
  //     return responseError(error.message || error);
  //   }
  // }

  @ApiOperation({ summary: 'Find one user' })
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    try {
      const result = await this.userService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.userService.remove(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  // @ApiOperation({ summary: 'Add board' })
  // @Post()
  // async addBoard(
  //   @Param('idUser') idUser: string,
  //   @Param('idBoard') idBoard: string,
  // ) {
  //   try {
  //     const result = await this.userService.addBoard(idUser, idBoard);
  //     return responseSuccess(result);
  //   } catch (error) {
  //     this.logger.error(error.stack);
  //     return responseError(error.message || error);
  //   }
  // }
}
