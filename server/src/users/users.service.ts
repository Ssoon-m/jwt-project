import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });
    if (isExist) {
      throw new ForbiddenException('이미 존재하는 유저입니다.');
    }
    const user = await this.usersRepository.save(createUserDto);
    const tokens = await this.authService.generateTokens(user);
    return { tokens, user };
  }

  async findOne(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
