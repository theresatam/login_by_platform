import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('social_media_profile')
export class SocialMediaProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'platform_id' })
  platformId: string;

  @Column()
  platform: string;
  @Column({ name: 'access_token' })
  accessToken: string;

  @ManyToOne(() => User, (user) => user.socialMediaProfiles)
  user: User;
}
