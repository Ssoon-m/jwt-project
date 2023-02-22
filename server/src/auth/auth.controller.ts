import {
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
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        userId: req.user.id,
        username: req.user.username,
      },
    );
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 30),
      path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      path: '/',
    });
    return { accessToken, refreshToken };
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
