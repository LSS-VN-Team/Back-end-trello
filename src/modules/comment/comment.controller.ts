import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentFilterDto } from './dto/filter-comment.dto';

@ApiTags('Comment')
@Controller('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  private readonly logger = new Logger(CommentController.name);

  @ApiOperation({ summary: 'Find all cmt' })
  @Get()
  async findAll(
    @Query() filter: CommentFilterDto,
    @Pagination() Pagination: PaginationOptions,
  ) {
    try {
      const result = await this.commentService.findAll(filter, Pagination);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Find one comment' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.commentService.findOne(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Create Comment' })
  @Post()
  async create(@Body() data: CreateCommentDto) {
    try {
      const result = await this.commentService.create(data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Delete Cmt' })
  @Delete('id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.commentService.remove(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
