import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
} from '../../constants/database';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../../constants/auth';
import { UsersModule } from '../users/users.module';
import { User } from '../../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>(SECRET),
          }),
          inject: [ConfigService],
        }),
        UsersModule,
      ],
      providers: [AuthService],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sing up and sign in user', async () => {
    const userDTO = { email: 'test@gmail.com', password: 'asdASD1!' };

    expect(await service.signUpUser(userDTO)).toBeDefined();
    expect(await service.signInUser(userDTO, true)).toBeDefined();

    expect(await service.removeUser(userDTO.email)).toBeDefined();
  });
});
