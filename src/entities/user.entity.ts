import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SocialMediaProfile } from './social-media-profile.entity';
import { Authenticate } from './authenticate.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;
  @OneToMany(() => Authenticate, (authenticate) => authenticate.user)
  authentications: Authenticate[];

  @OneToMany(() => SocialMediaProfile, (profile) => profile.user, {
    cascade: true,
  })
  socialMediaProfiles: SocialMediaProfile[];
}
