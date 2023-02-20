import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto as UserDTO } from 'src/users/user.dto';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userDTO: UserDTO) {
    const { password, ...user } = userDTO;
    return user;
  }
}
