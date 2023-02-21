// user.dto.ts
import { IsString } from 'class-validator';

export class TokenDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
