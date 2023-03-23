import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, BoardModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
