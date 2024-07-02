import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FbController } from './fb.controller';
import { FbService } from './fb.service';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/data-source';
import { SocialMediaProfile } from '../entities/social-media-profile.entity';
import { User } from '../entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Authenticate } from '../entities/authenticate.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppService } from 'src/app.service';
import { TokenValidationService } from 'src/tokenValidation.service';

@Module({
  imports: [
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
  controllers: [FbController],
  providers: [
    FbService,
    FacebookStrategy,
    JwtStrategy,
    ConfigService,
    AppService,
    TokenValidationService,
  ],
  exports: [JwtModule],
})
export class FbModule {}
