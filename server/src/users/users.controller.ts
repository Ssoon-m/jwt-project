import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { tokenCookieGenerator } from 'src/auth/auth.controller';
import { Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, user } = await this.usersService.create(createUserDto);
    const { setTokenCookie } = tokenCookieGenerator(res);
    setTokenCookie('access_token', tokens.accessToken);
    setTokenCookie('refresh_token', tokens.refreshToken);
    return { tokens, user };
  }

  // @Post('/admin')
  // async grantAdmin() {}
}
