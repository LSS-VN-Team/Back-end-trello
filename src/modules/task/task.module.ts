import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { Card, CardSchema } from '../card/card.schema';
import { CardService } from '../card/card.service';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from './task.schema';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
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
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, CardService, BoardService, UserService],
})
export class TaskModule {}
