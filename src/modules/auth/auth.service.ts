import { sha512 } from '@app/common';
import { appConfig } from '@app/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
// import { env } from "process";

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const { email } = data;
    const isExistEmail = await this.userModel.findOne({ email }).lean();

    if (isExistEmail && isExistEmail.email != email) {
      throw new Error('This account is not correct!');
    }
    if (isExistEmail && isExistEmail.password != sha512(data.password)) {
      throw new Error('This password is not correct!');
    } else {
      const payload = { uid: isExistEmail._id };
      delete isExistEmail.password;
      return {
        access_token: this.jwtService.sign(payload, {
          secret: appConfig.jwt.JWT_SECRET_KEY,
        }),
        ...isExistEmail,
      };
    }
  }

  async register(data: RegisterDto) {
    const { email } = data;

    const isExistEmail = await this.userModel.findOne({ email });
    if (isExistEmail) {
      throw new Error('This email already exists');
    }
    data.password = sha512(data.password);
    const newUser = new this.userModel(data);
    const user = await newUser.save();

    // const res = delete user.password ;
    return user;
  }
}
