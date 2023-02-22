// user.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class AccessTokenDTO {
  @IsNumber()
  tokenId: number;
  @IsNumber()
  userId: number;
  @IsString()
  username: string;
}
export class RefreshTokenDTO {
  @IsNumber()
  tokenId: number;
  @IsNumber()
  rotationCounter: number;
}
