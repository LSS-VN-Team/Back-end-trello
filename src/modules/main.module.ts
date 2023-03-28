import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, BoardModule,CardModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
