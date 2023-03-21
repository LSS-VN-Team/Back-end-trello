import { Module } from '@nestjs/common';
import { MainModule } from './modules/main.module';
import { CoreModule } from '@app/core';

@Module({
  imports: [CoreModule, MainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
