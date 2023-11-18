import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../../models/device.model';
import { User } from '../../models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DB_HOST,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
} from '../../constants/database';

describe('DevicesService', () => {
  let service: DevicesService;
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
        TypeOrmModule.forFeature([User, Device]),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [DevicesService],
    }).compile();

    service = moduleRef.get<DevicesService>(DevicesService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  const user = { id: 15 };
  const deviceDTO = { id: 0 };

  it('should add a new device', async () => {
    const createdDevice = await service.create(user as User, deviceDTO);

    expect(await service.findOne({ id: createdDevice.id })).toBeDefined();

    expect(createdDevice).toBeDefined();
    expect(createdDevice.id).toEqual(0);
    expect(createdDevice.user.id).toEqual(15);
  }, 10000);

  it('should find an existing device', async () => {
    const foundDevice = await service.findOne({ id: deviceDTO.id });

    expect(foundDevice).toBeDefined();
    expect(foundDevice.id).toEqual(deviceDTO.id);
    expect(foundDevice.user.id).toEqual(user.id);
  });

  it('should find all devices for a user', async () => {
    const foundDevices = await service.find({ user });

    expect(foundDevices).toHaveLength(1);
  });

  it('should update an existing device', async () => {
    let device = await service.findOne({ id: deviceDTO.id });
    expect(device.nfcData).toEqual('');

    await service.update({ id: device.id }, { nfcData: '2' });

    device = await service.findOne({ id: device.id });

    expect(device.nfcData).toEqual('2');
  });

  it('should remove an existing device', async () => {
    await service.remove({ id: deviceDTO.id });

    const foundDevice = await service.findOne({ id: deviceDTO.id });

    expect(foundDevice).toBeNull();
  });
});
