import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TokenValidationService {
  async validateFacebookToken(accessToken: string): Promise<boolean> {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id`,
      );

      if (data.error) {
        console.error('Error from Facebook Graph API:', data.error);
        return false;
      }

      console.log(data);

      return true;
    } catch (error) {
      console.error('Error validating Facebook token:', error);
      return false;
    }
  }

  async validateGoogleToken(accessToken: string): Promise<boolean> {
    try {
      const { data } = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
      );

      if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
        console.error('Invalid Google token.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating Google token:', error);
      return false;
    }
  }
}
