import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserAuthority } from './entity/user-authority.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    TypeOrmModule.forFeature([Token, UserAuthority, User]),
    JwtModule,
  ],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
