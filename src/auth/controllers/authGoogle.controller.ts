import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { GoogleGuard } from '../guards';

@UseGuards(GoogleGuard)
@Controller('auth')
export class AuthGoogleController {
  constructor(private configService: ConfigService) { }

  @Get('google')
  async getGoogle(@Res({ passthrough: true }) res: Response) {
    return { msg: 'Google redirecting...' };
  }

  @Get('google/callback')
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