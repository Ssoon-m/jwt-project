import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const isExist = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });
    if (isExist) {
      throw new ForbiddenException();
    }
    const { password, ...result } = await this.usersRepository.save(
      createUserDto,
    );
    return result;
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }
}
