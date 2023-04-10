import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import path from 'path';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardFilterDto } from './dto/filter-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  private readonly logger = new Logger(BoardController.name);

  @ApiOperation({ summary: 'Find all board' })
  @Get()
  async findAll(
    @Query() filter: BoardFilterDto,
    @Pagination() Pagination: PaginationOptions,
  ) {
    try {
      const result = await this.boardService.findAll(filter, Pagination);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Find one board' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.boardService.findOne(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Create Board' })
  @Post()
  async create(@Body() data: CreateBoardDto) {
    try {
      const result = await this.boardService.create(data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Update Board' })
  @Patch('/:id/:nameBoard')
  async update(@Param('id') id: string, @Param('nameBoard') data: string) {
    try {
      const result = await this.boardService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete Board' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.boardService.remove(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Add member' })
  @Patch('/addMember/:idmember/:idboard')
  async addMember(
    @Param('idmember') idMember: string,
    @Param('idboard') idBoard: string,
  ) {
    try {
      const result = await this.boardService.addMember(idMember, idBoard);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Remove member' })
  @Patch('/removeMember/:idmember/:idboard')
  async removeMember(
    @Param('idmember') idMember: string,
    @Param('idboard') idBoard: string,
  ) {
    try {
      const result = await this.boardService.removeMember(idMember, idBoard);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
