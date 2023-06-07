import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  providers: [
    {
      provide: CloudinaryService,
      useFactory: async (config: ConfigService) => {
        const cloudName = config.get<string>('CLOUDINARY_CLOUD_NAME');
        const apiKey = config.get<string>('CLOUDINARY_API_KEY');
        const apiSecret = config.get<string>('CLOUDINARY_API_SECRET');

        v2.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        return new CloudinaryService(v2, config);
      },
      inject: [ConfigService]
    },
  ],
  exports: [CloudinaryService]
})
export class CloudinaryModule { }
