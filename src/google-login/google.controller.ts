import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google')
export class GoogleController {
  constructor(private readonly appService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    try {
      const result = await this.appService.googleLogin(req);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }
}
