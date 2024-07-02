import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SocialMediaProfile } from './entities/social-media-profile.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Authenticate } from './entities/authenticate.entity';

@Injectable()
export class FbService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SocialMediaProfile)
    private readonly socialMediaRepository: Repository<SocialMediaProfile>,
    @InjectRepository(Authenticate)
    private readonly authenticateRepository: Repository<Authenticate>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
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
    const newSocialMediaProfile = this.socialMediaRepository.create({
      platform,
      platformId,
      accessToken,
      user,
    });
    return this.socialMediaRepository.save(newSocialMediaProfile);
  }

  async generateJwtTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async saveAuthenticateTokens(
    user: User,
    accessToken: string,
    refreshToken: string,
  ): Promise<Authenticate> {
    const newAuthenticate = this.authenticateRepository.create({
      accessToken,
      refreshToken,
      user,
    });
    return this.authenticateRepository.save(newAuthenticate);
  }
  async facebookLogin(req): Promise<any> {
    if (!req.user) {
      return 'No user from Facebook';
    }

    const { email, firstName, lastName } = req.user.user;

    let user = await this.findUserByEmail(email);

    if (!user) {
      user = await this.createUser(email, firstName, lastName);
    }

    const platformName = 'facebook';

    await this.saveSocialMediaProfile(
      platformName,
      req.user.user.id,
      req.user.accessToken,
      user,
    );

    const { accessToken, refreshToken } = await this.generateJwtTokens(user);
    await this.saveAuthenticateTokens(user, accessToken, refreshToken);

    return {
      message: 'User information from Facebook',
      platform: platformName,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
      },
      accessToken,
      refreshToken,
    };
  }
}
