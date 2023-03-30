import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from '../card/card.schema';
import { CardService } from '../card/card.service';
import { CM, CommentSchema } from '../comment/comment.schema';
import { CommentService } from '../comment/comment.service';
import { Task, TaskSchema } from '../Task/task.schema';
import { TaskService } from '../Task/task.service';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { BoardController } from './board.controller';
import { Board, BoardSchema } from './board.schema';
import { BoardService } from './board.service';

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
  controllers: [BoardController],
  providers: [CardService, BoardService, UserService,TaskService,CommentService],
})
export class BoardModule {}
