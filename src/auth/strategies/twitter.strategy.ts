import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile, StrategyOptions } from '@superfaceai/passport-twitter-oauth2';

import { AuthService } from '../auth.service';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super(<StrategyOptions>{
      clientType: 'confidential',
      clientID: configService.get('TWITTER_CLIENT_ID'),
      clientSecret: configService.get('TWITTER_CLIENT_SECRET'),
      callbackURL: configService.get('TWITTER_CALLBACK_URL'),
      scope: ['tweet.read', 'users.read', 'offline.access'],
    })
  }

  async validate(
    _: any,
    __: string,
    profile: Profile,
    done: any,
  ) {
    const { id: provider_id, provider, displayName, photos, emails } = profile;

    const twitterProfile: TwitterUser = {
      provider_id,
      provider,
      displayName,
      email: emails?.[0]?.value,
      photo: photos?.[0]?.value,
    }

    const result = await this.authService.validateTwitterUser(twitterProfile);

    return done(null, result);
  }
}

export interface TwitterUser {
  provider_id: string,
  provider: string,
  displayName: string,
  email: string,
  photo: string,
}