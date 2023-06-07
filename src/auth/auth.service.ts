import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignupDto, SigninDto } from './dtos';
import { UserDocument, UserSchema } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { GithubUser, GoogleUser, TwitterUser } from './strategies';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<typeof UserSchema>,
    @InjectModel('Profile') private profileModel: Model<typeof ProfileSchema>,
    private config: ConfigService,
    private jwt: JwtService,
  ) { }

  async signup(dto: SignupDto) {
    const session: ClientSession = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const hash = await bcrypt.hash(dto.password, 10);

      const user: any = new this.userModel({
        email: dto.email,
        password: hash,
      });

      const errors = user.validateSync();

      if (errors) {
        throw new ForbiddenException('Invalid credentials');
      }

      const createdUser = await user.save({ session });

      const profile = new this.profileModel({ user: createdUser._id });
      const profileErrors = profile.validateSync();

      if (profileErrors) {
        throw new ForbiddenException('Invalid profile');
      }
      await session.commitTransaction();

      await profile.save({ session });

      const { access_token } = await this.signToken(user._id, user.email);

      user.jwt_token = access_token;
      user.save({ session });

      return {
        access_token
      };
    } catch (error) {
      await session.abortTransaction();

      if (error.code === 11000) {
        throw new ForbiddenException('Invalid credentials');
      }

      throw new ForbiddenException(error.message);
    } finally {
      session.endSession();
    }
  };

  async signin(dto: SigninDto) {
    const user: any = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user || !user.password) {
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    };

    const pwValid = await bcrypt.compare(dto.password, user.password!);

    if (!pwValid) {
      throw new ForbiddenException(
        'Credentials incorrect'
      )
    };

    const { access_token } = await this.signToken(user._id, user.email);

    await this.userModel.findByIdAndUpdate(user._id, {
      jwt_token: access_token
    });

    return {
      access_token: access_token
    };
  };

  async signToken(userId: Types.ObjectId, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }
    );

    return {
      access_token: token,
    }
  };


  async validateGoogleUser(profile: GoogleUser) {
    let user: UserDocument = await this.userModel.findOne({
      provider_id: profile.provider_id
    });

    if (!user) {
      const newUser = new this.userModel({
        email: profile.email,
        provider: profile.provider,
        provider_id: profile.provider_id,
      });

      user = await newUser.save() as any;

      await this.profileModel.create({
        photo: {
          url: profile.photo
        },
        name: profile.displayName,
        user: user._id,
      });
    }

    const { access_token } = await this.signToken(user._id, user.email);
    user.jwt_token = access_token;
    user.save();

    return {
      access_token
    }
  };

  async validateTwitterUser(profile: TwitterUser) {
    let user: UserDocument = await this.userModel.findOne({
      provider_id: profile.provider_id
    });

    if (!user) {
      const newUser = new this.userModel({
        email: profile?.email,
        provider: profile.provider,
        provider_id: profile.provider_id,
      });

      user = await newUser.save() as any;

      await this.profileModel.create({
        photo: {
          url: profile.photo
        },
        name: profile.displayName,
        user: user._id,
      });
    }

    const { access_token } = await this.signToken(user._id, user?.email);
    user.jwt_token = access_token;
    user.save();

    return {
      access_token
    }
  };

  async validateGithubUser(profile: GithubUser) {
    let user: UserDocument = await this.userModel.findOne({
      provider_id: profile.provider_id
    });

    if (!user) {
      const newUser = new this.userModel({
        email: profile?.email,
        provider: profile.provider,
        provider_id: profile.provider_id,
      });

      user = await newUser.save() as any;

      await this.profileModel.create({
        photo: {
          url: profile.photo
        },
        name: profile.displayName,
        user: user._id,
        biography: profile.bio,
      });
    }

    const { access_token } = await this.signToken(user._id, user?.email);
    user.jwt_token = access_token;
    user.save();

    return {
      access_token
    }
  };
}
