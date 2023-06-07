import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) { }

  getMongoConfig(): MongooseModuleOptions {
    const connection = this.configService.get('MONGO_CONNECTION');
    const user = this.configService.get('MONGO_USER');
    const password = this.configService.get('MONGO_PASSWORD');
    const cluster = this.configService.get('MONGO_CLUSTER');
    const dbName = this.configService.get('MONGO_DB');

    return {
      uri: `${connection}://${user}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`,
    };
  }
}