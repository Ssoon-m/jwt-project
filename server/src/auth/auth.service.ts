import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Token } from './entity/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configServie: ConfigService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async validateUser(username: string, password: string): Promise<any | null> {
    const user = await this.usersService.findOne(username);
    const token = await this.tokenRepository.save({ user });
    console.log('token', token);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // async generateTokens(user: UserInfoDto): Promise<any> {
  //   // const { id: userId, username } = user;

  //   console.log('token', token);
  // }
  // async createTokenItem(userId : number){
  //   const token = await
  // }
}
