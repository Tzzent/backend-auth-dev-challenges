import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './entities/user.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileSchema } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Profile', schema: ProfileSchema },
    ]),
    ProfileModule,
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
