import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-github2';

import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
    })
  }

  async validate(
    _: any,
    __: any,
    profile: any,
  ) {
    const { id: provider_id, displayName, provider, photos, emails, _json: { bio } } = profile;

    const githubProfile: GithubUser = {
      provider_id,
      displayName,
      provider,
      photo: photos?.[0]?.value,
      email: emails?.[0]?.value,
      bio,
    }

    const result = await this.authService.validateGithubUser(githubProfile);

    return result;
  }
}

export interface GithubUser {
  provider_id: string,
  provider: string,
  displayName: string,
  email: string,
  photo: string,
  bio: string,
}