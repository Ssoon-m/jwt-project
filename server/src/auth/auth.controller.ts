import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, ITokenResponse } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: { user: ITokenResponse },
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('access_token', req.user.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 30),
      path: '/',
    });
    res.cookie('refresh_token', req.user.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      path: '/',
    });
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
    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 30),
      path: '/',
    });
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      path: '/',
    });

    return token;
  }

  @Get('me')
  getProfile(
    @Headers('Authorization') header: string | undefined,
    @Req() req: Request,
  ) {
    const accessToken =
      header?.split('Bearer ')[1] ?? req.cookies['access_token'];
    const { username, userId } =
      this.authService.verifyAccessToken(accessToken);
    return { userId, username };
  }
}
