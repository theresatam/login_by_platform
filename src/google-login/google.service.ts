import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { SocialMediaProfile } from 'src/entities/social-media-profile.entity';
import { Authenticate } from 'src/entities/authenticate.entity';
import { Repository } from 'typeorm';
import { platform } from 'os';

@Injectable()
export class GoogleService {
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

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      return 'No user from Google';
    }

    const { email, firstName, lastName } = req.user;

    let user = await this.findUserByEmail(email);

    if (!user) {
      user = await this.createUser(email, firstName, lastName);
    }
    const platfromName = 'google';

    await this.saveSocialMediaProfile(
      'google',
      req.user.id,
      req.user.accessToken,
      user,
    );

    const { accessToken, refreshToken } = await this.generateJwtTokens(user);
    await this.saveAuthenticateTokens(user, accessToken, refreshToken);

    return {
      message: 'User information from Google',
      platform: platfromName,
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
