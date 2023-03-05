// user.dto.ts
import { IsArray, IsNumber, IsString } from 'class-validator';
import { RoleType } from '../type/role-type';

export class AccessTokenDTO {
  @IsNumber()
  tokenId: number;
  @IsNumber()
  userId: number;
  @IsArray()
  authorities: RoleType[];
  @IsString()
  username: string;
}
export class RefreshTokenDTO {
  @IsNumber()
  tokenId: number;
  @IsNumber()
  rotationCounter: number;
}
