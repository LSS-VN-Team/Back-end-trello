import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardController } from './card.controller';
import { Card, CardSchema } from './card.schema';
import { CarsdService } from './card.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Card.name,
        schema: CardSchema,
      },
    ]),
  ],
  controllers: [CardController],
  providers: [CarsdService],
})
export class CardModule {}
