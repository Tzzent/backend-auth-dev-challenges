import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { FacebookGuard } from '../guards';

@UseGuards(FacebookGuard)
@Controller('auth')
export class AuthFacebookController {

  @Get('facebook')
  async getFacebook(@Res({ passthrough: true }) res: Response) {
    return { msg: 'Facebook redirecting...' };
  }

  @Get('facebook/callback')
  async getAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // const { access_token } = req?.user as { access_token: string };

    console.log(req?.user);

    // res.cookie('access_token', access_token, {
    //   domain: 'localhost',
    //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    // });

    // res.redirect('http://localhost:5173/')

    return {
      msg: 'ok',
    }
  }

}