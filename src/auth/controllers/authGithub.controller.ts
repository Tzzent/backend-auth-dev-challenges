import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { GithubGuard } from '../guards';

@UseGuards(GithubGuard)
@Controller('auth')
export class AuthGithubController {
  constructor(private configService: ConfigService) { }

  @Get('github')
  async getGithub(@Res({ passthrough: true }) res: Response) {
    return { msg: 'Github redirecting...' };
  }

  @Get('github/callback')
  async getAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = req?.user as { access_token: string };

    res.cookie('access_token', access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    }).redirect(this.configService.get('CORS_URL_ORIGIN'));
  }

}