import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoggerMiddleware } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public').replace('\\dist', ''),
    }),
    //
    MongooseModule.forRoot(appConfig.database.MONGO_DB.DB_URI),
    //
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig.jwt.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: appConfig.jwt.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [JwtAuthGuard, RolesGuard, JwtStrategy, JwtService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
