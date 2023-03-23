import { sha512 } from '@app/common';
import { appConfig } from '@app/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async login(data: LoginDto) {
    const { email } = data;
    // console.log(data);

    const isExistsEmail = await this.userModel.findOne({ email }).lean();
    if (isExistsEmail && isExistsEmail.email != email) {
      throw new Error('An account is not available !');
    }
    if (isExistsEmail && isExistsEmail.password != sha512(data.password)) {
      throw new Error('The password is not correct ! ');
    } else {
      const payload = { uid: isExistsEmail._id };
      delete isExistsEmail.password;
      return {
        access_token: this.jwtService.sign(payload, {
          secret: appConfig.jwt.JWT_SECRET_KEY,
        }),
        ...isExistsEmail,
      };
      //   return isExistsEmail.password;
    }
  }
  async register(data: RegisterDto) {
    const { email } = data;
    const isExistsEmail = await this.userModel.findOne({ email });
    if (isExistsEmail) {
      throw new Error('This email already exists !');
    }
    data.password = sha512(data.password);

    const newUser = new this.userModel(data);

    const user = await newUser.save();

    return user;
  }
}
