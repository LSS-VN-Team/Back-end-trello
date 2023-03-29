import { Pagination, PaginationOptions } from '@app/common';
import { responseError, responseSuccess } from '@app/core/base/base.controller';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { CardFilterDto } from './dto/filter-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Card')
@Controller('Card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  private readonly logger = new Logger(CardController.name);

  @ApiOperation({ summary: 'Find all card' })
  @Get()
  async findAll(
    @Query() filter: CardFilterDto,
    @Pagination() Pagination: PaginationOptions,
  ) {
    try {
      const result = await this.cardService.findAll(filter, Pagination);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Find one card' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.cardService.findOne(id);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Create Card' })
  @Post()
  async create(@Body() data: CreateCardDto) {
    try {
      const result = await this.cardService.create(data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
  @ApiOperation({ summary: 'Update Card' })
  @Patch('id')
  async update(@Param('id') id: string, @Body() data: UpdateCardDto) {
    try {
      const result = await this.cardService.update(id, data);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }

  @ApiOperation({ summary: 'Delete Card' })
  @Delete('/removeCard/:idCard/:idBoard')
  async remove(
    @Param('idCard') idCard: string,
    @Param('idBoard') idBoard: string,
  ) {
    try {
      const result = await this.cardService.remove(idCard, idBoard);
      return responseSuccess(result);
    } catch (error) {
      this.logger.error(error.stack);
      return responseError(error.message || error);
    }
  }
}
