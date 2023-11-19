import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
} from '../../constants/database';
import { UsersService } from './users.service';
import { Device } from '../../models/device.model';

describe('UsersService', () => {
  let service: UsersService;
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
              entities: [User, Device],
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [UsersService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  const userDTO = {
    id: 0,
    email: 'testUser@gmail.com',
    password: 'asdASD1!',
  };

  it('should create a user', async () => {
    const createdUser = await service.create(userDTO);

    const foundUser = await service.findOne({ id: createdUser.id });

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBeDefined();
    expect(foundUser.email).toEqual('testUser@gmail.com');

    await service.remove(createdUser.id);
    expect(await service.findOne({ id: createdUser.id })).toBeNull();
  });

  it('should find a user by id', async () => {
    const createdUser = await service.create(userDTO);

    const foundUser = await service.findOne({ id: createdUser.id });

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toEqual(createdUser.id);
    expect(foundUser.email).toEqual(createdUser.email);

    await service.remove(foundUser.id);
    expect(await service.findOne({ id: foundUser.id })).toBeNull();
  });

  it('should find all users', async () => {
    const createdUser = await service.create(userDTO);

    const foundUsers = await service.find();

    expect(foundUsers).toBeDefined();

    await service.remove(createdUser.id);
    expect(await service.findOne({ id: createdUser.id })).toBeNull();
  });

  it('should update a user', async () => {
    const createdUser = await service.create(userDTO);

    const updatedUser = await service.update(createdUser.id, { balance: 100 });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.id).toEqual(createdUser.id);
    expect(updatedUser.balance).toEqual(100);

    await service.remove(createdUser.id);
    expect(await service.findOne({ id: createdUser.id })).toBeNull();
  });

  it('should remove a user', async () => {
    const createdUser = await service.create(userDTO);

    await service.remove(createdUser.id);

    const foundUser = await service.findOne({ id: createdUser.id });

    expect(foundUser).toBeNull();
  });

  it('should check if a user has lost devices, should be true', async () => {
    const createdUser = await service.create(userDTO);

    jest
      .spyOn(service, 'userHasLostDevices')
      .mockImplementation(async (args: any) => true);

    const userHasLostDevices = await service.userHasLostDevices(createdUser.id);

    expect(userHasLostDevices).toEqual(true);
    await service.remove(createdUser.id);
    expect(await service.findOne({ id: createdUser.id })).toBeNull();
  });

  it('should check if a user has lost devices, should be false', async () => {
    const createdUser = await service.create(userDTO);

    jest
      .spyOn(service, 'userHasLostDevices')
      .mockImplementation(async (args: any) => false);

    const userHasLostDevices = await service.userHasLostDevices(createdUser.id);

    expect(userHasLostDevices).toEqual(false);
    await service.remove(createdUser.id);
    expect(await service.findOne({ id: createdUser.id })).toBeNull();
  });
});
