import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../board/board.schema';
import { Card, CardSchema } from '../card/card.schema';
import { Task, TaskSchema } from '../Task/task.schema';
import { User, UserSchema } from '../user/user.schema';
import { CommentController } from './comment.controller';
import { CM, CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

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
      {
        name: CM.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
