import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Patch, Query } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Board, BoardDocument } from './board.schema';
import { BoardService } from './board.service';
import { BoardDto } from './dtos/create-board.dto';
import { FillterBoardDto } from './dtos/fillter-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';

@ApiTags('Project Board')
@Controller('board')
export class BoardController {
  @InjectModel(Board.name)
  private readonly boardModel: Model<BoardDocument>;
  constructor(private readonly boardService: BoardService) {}

  private readonly logger = new Logger(BoardController.name);

  @ApiOperation({ summary: 'Project Board' })
  @Post()
  async create(@Body() data: BoardDto) {
    try {
      const result = await this.boardService.create(data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Get all Project Board' })
  @Get('get')
  async getAll(
    @Query() filter: FillterBoardDto,
    @Pagination() pagination: PaginationOptions,
  ) {
    try {
      const result = await this.boardService.getAll(filter, pagination);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @Get('/findall/:id')
  async findAll(): Promise<Board[]> {
    return this.boardService.findAll();
  }
  @ApiOperation({ summary: 'Get a board by id' })
  @Get('/getbyid/:id')
  async getById(@Param('id') id: string) {
    try {
      const result = await this.boardService.getById(id);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @Get('/findone/:id')
  async findOne(@Param('id') id: string): Promise<Board> {
    return this.boardService.findOne(id);
  }
  @ApiOperation({ summary: 'Update a project board' })
  @Put(':id')
  async updateById(@Param('id') id: string, @Body() data: BoardDto) {
    try {
      const result = await this.boardService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete a Project board' })
  @Delete(':id')
  async removeID(@Param('id') id: string) {
    try {
      const result = await this.boardService.remove(id);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Add member Project board' })
  @Patch('/addMember/:idmember/:idboard')
  async addMember(
    @Param('idmember') idmember: string,
    @Param('idboard') idboard: string,
  ) {
    try {
      const result = await this.boardService.addMember(idmember, idboard);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'remove member' })
  @Patch('/remove/:idmember/:idboard')
  async removeMember(
    @Param('idmember') idmember: string,
    @Param('idboard') idboard: string,
  ) {
    try {
      const result = await this.boardService.removeMember(idmember, idboard);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
