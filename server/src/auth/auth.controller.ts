import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto as UserDTO } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        userId: req.user.id,
        username: req.user.username,
      },
    );
    return { accessToken, refreshToken };
  }
}
