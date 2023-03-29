import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
        name: Board.name,
        schema: BoardSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService, UserService],
})
export class BoardModule {}
