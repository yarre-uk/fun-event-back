import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/app/users/users.module';
import { User } from '../shared/models/user.model';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
} from 'src/shared/constants/database';

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
          entities: [User],
        };
      },

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthGuard,
  //   },
  // ],
})
export class AppModule {}
