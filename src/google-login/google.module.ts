import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data-source';
import { Authenticate } from 'src/entities/authenticate.entity';
import { SocialMediaProfile } from 'src/entities/social-media-profile.entity';
import { User } from 'src/entities/user.entity';
import { TokenValidationService } from 'src/tokenValidation.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    TypeOrmModule.forRoot(dataSourceOptions),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([User, SocialMediaProfile, Authenticate]),
  ],
  providers: [GoogleService, GoogleStrategy, TokenValidationService],
})
export class GoogleModule {}
