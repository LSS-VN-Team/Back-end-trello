import { responseError, responseSuccess } from '@app/core/base/base.controller';
import { Body, Controller, Post } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Card, CardDocument } from './card.schema';
import { CarsdService } from './card.service';
import { CardDto } from './dtos/create-card.dto';

@ApiTags('Task card')
@Controller('card')
export class CardController {
  @InjectModel(Card.name)
  private readonly cardModel: Model<CardDocument>;
  constructor(private readonly cardService: CarsdService) {}

  private readonly logger = new Logger(CardController.name);

  @ApiOperation({ summary: 'Project Board' })
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
}
