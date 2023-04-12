import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
// import { ImageModule } from './imgBackgroud/image.module';
import { TaskModule } from './task/task.module';
import { UpLoadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
// import { CM } from './comment/comment/comment.schema';
// import { CommentModule } from './comment/comment/comment.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BoardModule,
    CardModule,
    UpLoadModule,
    // ImageModule,
    TaskModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
