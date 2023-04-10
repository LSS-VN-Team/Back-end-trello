import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: Schema }])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
