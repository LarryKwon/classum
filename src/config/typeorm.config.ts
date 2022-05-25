import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as config from 'config';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<'mysql'>('db.type'),
      host: this.configService.get<string>('db.host'),
      port: this.configService.get<number>('db.port'),
      username: this.configService.get<string>('db.username'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.database'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<boolean>('db.synchronize'),
      // logging: 'all',
    };
  }
}

// export const typeORMConfig: TypeOrmModuleOptions = {
//   type: dbConfig.type,
//   host: process.env.RDS_HOSTNAME || dbConfig.host,
//   port: process.env.RDS_PORT || dbConfig.port,
//   username: process.env.RDS_USERNAME || dbConfig.username,
//   password: process.env.RDS_PASSWORD || dbConfig.password,
//   database: process.env.RDS_DB_NAME || dbConfig.database,
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   synchronize: dbConfig.synchronize,
// };
