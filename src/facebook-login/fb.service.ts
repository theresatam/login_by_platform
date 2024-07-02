import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SocialMediaProfile } from '../entities/social-media-profile.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';

@Injectable()
export class FbService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SocialMediaProfile)
    private readonly socialMediaRepository: Repository<SocialMediaProfile>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserByPlatformId(platformId: string): Promise<User | undefined> {
    const socialMediaProfile = await this.socialMediaRepository.findOne({
      where: { platformId },
      relations: ['user'],
    });

    if (socialMediaProfile) {
      return socialMediaProfile.user;
    }

    return undefined;
  }

  async createUser(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const newUser = this.userRepository.create({ email, firstName, lastName });
    return this.userRepository.save(newUser);
  }

  async saveSocialMediaProfile(
    platform: string,
    platformId: string,
    accessToken: string,
    user: User,
  ): Promise<SocialMediaProfile> {
    let socialMediaProfile = await this.socialMediaRepository.findOne({
      where: { user, platform },
    });

    if (socialMediaProfile) {
      socialMediaProfile.accessToken = accessToken;
      socialMediaProfile.platformId = platformId;
    } else {
      socialMediaProfile = this.socialMediaRepository.create({
        platform,
        platformId,
        accessToken,
        user,
      });
    }

    return this.socialMediaRepository.save(socialMediaProfile);
  }

  async generateJwtTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async verifyFacebookToken(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,first_name,last_name,email`,
      );
      const profile = await response.json();
      if (!profile || profile.error) {
        return null;
      }
      return profile;
    } catch (error) {
      return null;
    }
  }

  async storeFacebookAccessToken(
    email: string,
    platformId: string,
    accessToken: string,
  ): Promise<any> {
    let profile = await this.verifyFacebookToken(accessToken);
    if (!profile) {
      throw new UnauthorizedException('Invalid Facebook token');
    }

    const { email: facebookEmail, first_name, last_name } = profile;

    let user = await this.findUserByPlatformId(platformId);

    if (user) {
      if (user.email !== facebookEmail) {
        user.email = facebookEmail;
        await this.userRepository.save(user);
      }
    } else {
      user = await this.findUserByEmail(facebookEmail);
      if (!user) {
        user = await this.createUser(
          facebookEmail,
          first_name || '',
          last_name || '',
        );
      }
    }

    const platform = 'facebook';

    await this.saveSocialMediaProfile(platform, platformId, accessToken, user);

    const { accessToken: jwtAccessToken, refreshToken } =
      await this.generateJwtTokens(user);

    return {
      message: 'Facebook access token stored successfully',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
      },
      accessToken: jwtAccessToken,
      refreshToken,
    };
  }
}
