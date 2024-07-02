import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FbModule } from './facebook-login/fb.module';
import { FbService } from './facebook-login/fb.service';
import { FbController } from './facebook-login/fb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authenticate } from './entities/authenticate.entity';
import { SocialMediaProfile } from './entities/social-media-profile.entity';
import { User } from './entities/user.entity';
import { GoogleModule } from './google-login/google.module';
import { GoogleController } from './google-login/google.controller';
import { GoogleService } from './google-login/google.service';
import { TokenValidationService } from './tokenValidation.service';
@Module({
  imports: [
    FbModule,
    GoogleModule,
    TypeOrmModule.forFeature([User, SocialMediaProfile, Authenticate]),
  ],
  controllers: [AppController, FbController, GoogleController],
  providers: [AppService, FbService, GoogleService, TokenValidationService],
})
export class AppModule {}
