import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { CardController } from './card.controller';
import { Card, CardSchema } from './card.schema';
import { CardService } from './card.service';
import { Task, TaskSchema } from '../task/task.schema';
import { TaskService } from '../task/task.service';

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
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, BoardService, UserService, TaskService],
})
export class CardModule {}
