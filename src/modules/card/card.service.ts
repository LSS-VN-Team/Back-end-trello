import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './card.schema';
import { CardDto } from './dtos/create-card.dto';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}
  async create(data: CardDto): Promise<Card> {
    const projectBoard = new this.cardModel(data);
    return projectBoard.save();
  }
}
