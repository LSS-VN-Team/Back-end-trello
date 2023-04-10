import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Board, BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { Card, CardSchema } from '../card/card.schema';
import { CardService } from '../card/card.service';
import { Task, TaskSchema } from '../task/task.schema';
import { TaskService } from '../task/task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Board.name,
        schema: BoardSchema,
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
  controllers: [UserController],
  providers: [UserService, BoardService, CardService, TaskService],
})
export class UserModule {}
