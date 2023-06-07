import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthJwtController } from './controllers/authJwt.controller';
import { UserSchema } from 'src/user/entities/user.entity';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { GithubStrategy, GoogleStrategy, JwtStrategy } from './strategies';
import { AuthGoogleController } from './controllers/authGoogle.controller';
import { FacebookStrategy, TwitterStrategy } from './strategies';
import { AuthFacebookController } from './controllers/authFacebook.controller';
import { AuthTwitterController } from './controllers/authTwitter.controller';
import { AuthGithubController } from './controllers/authGithub.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Profile', schema: ProfileSchema },
    ]),
    JwtModule.register({}),
    PassportModule,
  ],
  controllers: [
    AuthJwtController,
    AuthGoogleController,
    AuthFacebookController,
    AuthTwitterController,
    AuthGithubController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    TwitterStrategy,
    GithubStrategy,
  ],
})
export class AuthModule { }
