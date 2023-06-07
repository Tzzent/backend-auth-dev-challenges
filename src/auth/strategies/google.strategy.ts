import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id: provider_id, provider, displayName, emails, photos } = profile;

    const googleProfile: GoogleUser = {
      provider_id,
      provider,
      displayName,
      email: emails[0].value,
      photo: photos[0].value,
    }

    const result = await this.authService.validateGoogleUser(googleProfile);
    return done(null, result);
  }
}

export interface GoogleUser {
  provider_id: string,
  provider: string,
  displayName: string,
  email: string,
  photo: string,
}