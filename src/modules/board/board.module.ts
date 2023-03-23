import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { BoardController } from './board.controller';
import { Board, BoardSchema } from './board.schema';
import { BoardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Board.name,
        schema: BoardSchema,
      },
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
