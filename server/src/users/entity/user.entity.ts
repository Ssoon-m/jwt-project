import { Token } from 'src/auth/entity/token.entity';
import { UserAuthority } from 'src/auth/entity/user-authority.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => UserAuthority, (UserAuthority) => UserAuthority.user, {
    eager: true,
  })
  authorities?: UserAuthority[];
}
