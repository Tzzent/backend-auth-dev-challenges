import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Request } from 'express';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { UserDocument, UserSchema } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectModel('User') private userModel: Model<typeof UserSchema>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    })
  };

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }

    return null;
  }

  async validate(req: Request, payload: {
    sub: number,
    email: string,
  }) {
    const user: UserDocument = await this.userModel.findOne({ _id: payload.sub });


    if (!user || user.jwt_token !== req.cookies.access_token) {
      return null;
    }

    return user;
  }

}