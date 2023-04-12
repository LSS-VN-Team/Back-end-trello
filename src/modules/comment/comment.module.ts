import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CM, CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';
// import { Task, TaskSchema } from 'src/modules/task/task.schema';
import { Board, BoardSchema } from 'src/modules/board/board.schema';
// import { User, UserSchema } from 'src/modules/user/user.schema';
import { Card, CardSchema } from 'src/modules/card/card.schema';
import { Task, TaskSchema } from 'src/modules/task/task.schema';
import { User, UserSchema } from 'src/modules/user/user.schema';

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
