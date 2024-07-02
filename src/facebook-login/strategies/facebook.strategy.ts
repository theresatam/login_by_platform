import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyFunction } from 'passport-facebook-token';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenValidationService } from 'src/tokenValidation.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly tokenValidationService: TokenValidationService) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: 'http://localhost:3000/facebook/redirect',
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: 'https://accounts.google.com/o/oauth2/token',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const isTokenValid =
      await this.tokenValidationService.validateFacebookToken(accessToken);

    if (!isTokenValid) {
      return done(new UnauthorizedException('Invalid Facebook token'), false);
    }

    const { id, emails, name } = profile;

    let firstName = '';
    let lastName = '';

    if (name && typeof name === 'string') {
      const nameParts = name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    } else if (name && typeof name === 'object') {
      firstName = name.givenName || '';
      lastName = name.familyName || '';
    }

    const user = {
      id: id,
      platformId: id,
      email: emails[0].value,
      firstName,
      lastName,
    };

    const payload = {
      user,
      accessToken,
    };

    return done(null, payload);
  }
}
