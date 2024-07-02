import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { FbService } from './fb.service';

@Controller('facebook')
export class FbController {
  constructor(private readonly fbService: FbService) {}

  @Post('redirect')
  async facebookAuthRedirect(@Body() body) {
    try {
      const { accessToken, email, platformId } = body;

      const profile = await this.fbService.verifyFacebookToken(accessToken);
      if (!profile) {
        throw new UnauthorizedException('Invalid Facebook token');
      }

      const result = await this.fbService.storeFacebookAccessToken(
        email,
        platformId,
        accessToken,
      );
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }
}
