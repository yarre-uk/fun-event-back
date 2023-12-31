import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../../constants/auth';
import { User } from '../../models/user.model';
import { ProfileController } from './profile.controller';
import { Device } from '../../models/device.model';

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
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
