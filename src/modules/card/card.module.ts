import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { CardController } from './card.controller';
import { Card, CardSchema } from './card.schema';
import { CardService } from './card.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Card.name,
        schema: CardSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Board.name,
        schema: BoardSchema,
      },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, BoardService, UserService],
})
export class CardModule {}
