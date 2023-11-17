import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from '../../models/device.model';
import { Repository } from 'typeorm';

describe('DevicesService', () => {
  let service: DevicesService;
  let deviceRepository: Repository<Device>;

  const DEVICE_REPOSITORY_TOKEN = getRepositoryToken(Device);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: DEVICE_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    deviceRepository = module.get<Repository<Device>>(DEVICE_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test the test', async () => {
    // jest.spyOn(service, 'test').mockImplementation(async () => result);
    const res = await service.test();

    console.log(1);
    await timeoutPromise(3);
    console.log(4);

    expect(res).toBe('Hello');
  }, 9000);
});

const timeoutPromise = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve('Hello'), seconds * 1000);
  });
