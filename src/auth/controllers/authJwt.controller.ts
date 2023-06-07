import {
  Body,
  Controller,
  Post,
  Res,
  Get,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from '../auth.service';
import { SignupDto, SigninDto } from '../dtos';

@Controller('/auth')
export class AuthJwtController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Post('/signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.signup(dto);

    res.cookie('access_token', access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  @Post('/signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.signin(dto);

    res.cookie('access_token', access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  @Get('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token', {
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });

    return {
      msg: 'You have been successfully logged out.',
    }
  }
}