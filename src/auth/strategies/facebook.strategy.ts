import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile, VerifyFunction } from 'passport-facebook';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserSchema } from 'src/user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @InjectModel('User') private userModel: Model<typeof UserSchema>,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      scope: ['email', 'name', 'picture', 'birthday'],
      profileFields: ['emails', 'name', 'picture'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {

    return done(null, profile);
  }
}