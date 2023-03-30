import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { CM, CommentSchema } from '../comment/comment.schema';
import { CommentService } from '../comment/comment.service';
import { Task, TaskSchema } from '../Task/task.schema';
import { TaskService } from '../Task/task.service';
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
        name: Board.name,
        schema: BoardSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema
      },
      {
        name: CM.name,
        schema: CommentSchema
      },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, BoardService, UserService,TaskService,CommentService],
})
export class CardModule {}
