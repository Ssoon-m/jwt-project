import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshTokenDTO, AccessTokenDTO } from './dto/token.dto';
import { Token } from './entity/token.entity';
import { UserAuthority } from './entity/user-authority.entity';
import { RoleType } from './type/role-type';

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(UserAuthority)
    private userAuthorityRepository: Repository<UserAuthority>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { accessToken, refreshToken } = await this.generateTokens(user);
      return { accessToken, refreshToken };
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

  async generateTokens(user: User, tokenItem?: Token): Promise<ITokenResponse> {
    const token = tokenItem ?? (await this.tokenRepository.save({ user }));
    const tokenId = token.id;

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        userId: user.id,
        username: user.username,
        authorities: user.authorities.map((user) => user.authorityName),
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
      if (!accessToken) {
        throw new UnauthorizedException('not exist access_token');
      }
      const verify = this.jwtService.verify<AccessTokenDTO>(accessToken, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      return verify;
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('token expired error');
      }
      throw e;
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const { tokenId, rotationCounter } =
        this.jwtService.verify<RefreshTokenDTO>(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        });
      const tokenItem = await this.tokenRepository.findOne({
        where: {
          id: tokenId,
        },
        relations: ['user'],
      });
      if (!tokenItem) {
        throw new UnauthorizedException('Token not found');
      }
      if (tokenItem.blocked) {
        throw new UnauthorizedException('Token is blocked');
      }
      if (tokenItem.rotationCounter !== rotationCounter) {
        await this.tokenRepository.update(
          {
            id: tokenItem.id,
          },
          { blocked: true },
        );
        throw new UnauthorizedException('Rotation counter does not match');
      }
      tokenItem.rotationCounter += 1;
      await this.tokenRepository.update(
        { id: tokenItem.id },
        { rotationCounter: tokenItem.rotationCounter },
      );
      return this.generateTokens(tokenItem.user, tokenItem);
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

  async grantRoleByUserId(userId: number, authorityName: RoleType) {
    const user = await this.usersService.findOneByUserId(userId);
    if (!user)
      throw new NotFoundException(
        'NOT_FOUND_USER',
        '사용자를 찾을 수 없습니다.',
      );

    const isExistAuthority = user.authorities.some(
      (user) => user.authorityName === authorityName,
    );
    if (isExistAuthority) throw new ConflictException('already exists roles');

    const userAuthority = await this.userAuthorityRepository.save({
      user,
      authorityName,
    });
    return userAuthority;
  }
}
