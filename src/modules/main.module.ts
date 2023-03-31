import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { ImageModule } from './imgBackgroud/image.module';
import { TaskModule } from './task/task.module';
import { UpLoadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BoardModule,
    CardModule,
    UpLoadModule,

    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
