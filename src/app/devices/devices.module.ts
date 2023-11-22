import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../../models/device.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../../constants/auth';
import { User } from '../../models/user.model';
import { UsersModule } from '../users/users.module';
import { DevicesAdminController } from './devices-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Device]),
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(SECRET),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [DevicesService],
  controllers: [DevicesController, DevicesAdminController],
  exports: [DevicesService],
})
export class DevicesModule {}
