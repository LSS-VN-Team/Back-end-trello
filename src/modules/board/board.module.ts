import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { BoardController } from './board.controller';
import { Board, BoardSchema } from './board.schema';
import { BoardService } from './board.service';
import { Card, CardSchema } from '../card/card.schema';
import { CardService } from '../card/card.service';
import { Task, TaskSchema } from '../task/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Board.name,
        schema: BoardSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Card.name,
        schema: CardSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService, UserService, CardService],
})
export class BoardModule {}
