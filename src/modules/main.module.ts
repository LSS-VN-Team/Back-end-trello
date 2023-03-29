import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { TaskModule } from './Task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, BoardModule, CardModule,TaskModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
