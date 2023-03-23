import { Module } from '@nestjs/common';
import { MainModule } from './modules/main.module';
import { CoreModule } from '@app/core';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CoreModule, MainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
