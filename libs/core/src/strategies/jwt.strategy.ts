import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { appConfig } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwt.JWT_SECRET_KEY,
    });
  }

  authenticate(req, options) {
    if (req.handshake) {
      req.headers = req.headers || {};
      req.headers.authorization = `Bearer ${req.handshake?.query?.token}`;
    }
    super.authenticate(req, options);
  }

  async validate(payload: any): Promise<any> {
    const { uid, role } = payload;

    return { id: uid, role: role } as any;
  }
}
