import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseService = new DatabaseService(configService);
        return databaseService.getMongoConfig();
      },
    }),
  ],
  exports: [MongooseModule],
  providers: [DatabaseService],
})
export class DatabaseModule { }
