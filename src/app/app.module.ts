import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/app/users/users.module';
import { User } from '../models/user.model';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Device } from '../models/device.model';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
} from '../constants/database';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>(DB_HOST),
          database: configService.get<string>(DB_DATABASE),
          username: configService.get<string>(DB_USER),
          password: configService.get<string>(DB_PASSWORD),
          port: 5432,
          ssl: true,
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Device],
        };
      },

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    DevicesModule,
  ],
})
export class AppModule {}
