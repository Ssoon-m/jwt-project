import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, ITokenResponse } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AccessTokenDTO } from './dto/token.dto';

export const tokenCookieGenerator = (res: Response) => {
  return {
    setTokenCookie(type: 'access_token' | 'refresh_token', token: string) {
      let expireAt: Date;
      if (type === 'access_token') {
        expireAt = new Date(Date.now() + 1000 * 30);
      } else if (type === 'refresh_token') {
        expireAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
      }
      res.cookie(type, token, {
        httpOnly: true,
        expires: expireAt,
        path: '/',
      });
    },
  };
};
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: { user: ITokenResponse } & Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { setTokenCookie } = tokenCookieGenerator(res);
    setTokenCookie('access_token', req.user.accessToken);
    setTokenCookie('refresh_token', req.user.refreshToken);

    return {
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Body() { refresh }: { refresh?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = refresh ?? req.cookies['refresh_token'] ?? '';
    if (!refreshToken) {
      throw new BadRequestException('empty refresh token');
    }
    const token = await this.authService.verifyRefreshToken(refreshToken);

    const { setTokenCookie } = tokenCookieGenerator(res);
    setTokenCookie('access_token', token.accessToken);
    setTokenCookie('refresh_token', token.refreshToken);
    return token;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: { user: AccessTokenDTO } & Request) {
    return req.user;
  }
}
