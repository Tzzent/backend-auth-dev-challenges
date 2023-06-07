import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    DatabaseModule,
    CloudinaryModule,
  ],
})
export class AppModule { }
