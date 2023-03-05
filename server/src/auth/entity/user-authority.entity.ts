import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleType } from '../type/role-type';

@Entity()
export class UserAuthority {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorityName: RoleType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.authorities)
  @JoinColumn({ name: 'userId' })
  user: User;
}
