// user.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export class UserInfoDto {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;
}
