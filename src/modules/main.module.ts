import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { TaskModule } from './Task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BoardModule,
    CardModule,
    TaskModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
