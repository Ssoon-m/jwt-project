import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

const fromAuthCookie = () => {
  return (req: Request) => {
    const accessToken =
      req.headers.authorization?.split('Bearer ')[1] ??
      req.cookies?.['access_token'];
    return accessToken;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: fromAuthCookie(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
