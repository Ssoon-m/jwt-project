import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshTokenDTO, AccessTokenDTO } from './dto/token.dto';
import { Token } from './entity/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async validateUser(username: string, password: string): Promise<any | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signAccessToken(payload: AccessTokenDTO) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async signRefreshToken(payload: RefreshTokenDTO) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async generateTokens(user: UserInfoDto, tokenItem?: Token): Promise<any> {
    const token = tokenItem ?? (await this.tokenRepository.save({ user }));
    const tokenId = token.id;

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        userId: user.userId,
        username: user.username,
        tokenId,
      }),
      this.signRefreshToken({
        tokenId,
        rotationCounter: token.rotationCounter,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  verifyAccessToken(accessToken: string) {
    try {
      const verify = this.jwtService.verify<AccessTokenDTO>(accessToken, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      return verify;
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('token expired error');
        case 'JsonWebTokenError':
          throw new UnauthorizedException('json web token error');
      }
      throw e;
    }
  }

  // async verifyRefreshToken(refreshToken: string) {
  // }
}
