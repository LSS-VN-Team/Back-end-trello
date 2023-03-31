import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Query } from '@nestjs/common';
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
import { Card, CardDocument } from './card.schema';
import { CardService } from './card.service';
import { CardDto } from './dtos/create-card.dto';
import { FillterCardDto } from './dtos/fillter-card.dto';

@ApiTags(' Task card')
@Controller('card')
export class CardController {
  @InjectModel(Card.name)
  private readonly cardModel: Model<CardDocument>;
  constructor(private readonly cardService: CardService) {}

  private readonly logger = new Logger(CardController.name);

  @ApiOperation({ summary: ' create Task Card' })
  @Post()
  async create(@Body() data: CardDto) {
    try {
      const result = await this.cardService.create(data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Get a card by id' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const result = await this.cardService.getById(id);
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
    @Query() filter: FillterCardDto,
    @Pagination() pagination: PaginationOptions,
  ) {
    try {
      const result = await this.cardService.getAll(filter, pagination);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @Get()
  async findAll(): Promise<Card[]> {
    return this.cardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Card> {
    return this.cardService.findOne(id);
  }
  @ApiOperation({ summary: 'Update a Task card' })
  @Put(':id')
  async updateById(@Param('id') id: string, @Body() data: CardDto) {
    try {
      const result = await this.cardService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete a Task card' })
  @Delete(':id')
  async removeID(@Param('id') id: string) {
    try {
      const result = await this.cardService.remove(id);
      return responseSuccess(result);
    } catch (error) {
      console.log(error.message);
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
