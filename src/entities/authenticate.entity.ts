import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Authenticate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.authentications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
