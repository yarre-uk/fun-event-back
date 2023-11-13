import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminAuth } from '../../decorators/auth';
import { DevicesService } from './devices.service';
import { CreateDeviceDTO } from './dtos/create-device.dto';
import { UsersService } from '../users/users.service';
import { UpdateDeviceDTO } from './dtos/update-device.dto';

@Controller('devices-admin')
export class DevicesController {
  constructor(
    private readonly deviceService: DevicesService,
    private readonly userService: UsersService,
  ) {}

  @AdminAuth()
  @Post()
  async addDevice(
    @Query('userId') userId: string,
    @Body() createDeviceDTO: CreateDeviceDTO,
  ) {
    if (Number.isNaN(+userId)) {
      return new Error('Id is not a number');
    }

    const entityWithId = await this.deviceService.findOne({
      id: createDeviceDTO.id,
      user: { id: parseInt(userId) },
    });

    if (!!entityWithId) {
      throw new ForbiddenException();
    }

    setTimeout(async () => {
      const entityForApprove = await this.deviceService.findOne({
        id: createDeviceDTO.id,
        user: { id: parseInt(userId) },
      });

      if (!entityForApprove.approved) {
        await this.deviceService.remove({
          id: entityForApprove.id,
          user: { id: parseInt(userId) },
        });
      }
    }, 60 * 1000);

    const user = await this.userService.findOne({ id: parseInt(userId) });

    return this.deviceService.create(user, {
      id: createDeviceDTO.id,
      user: { id: parseInt(userId) },
    });
  }

  @AdminAuth()
  @Get()
  getAll() {
    return this.deviceService.find({});
  }

  @AdminAuth()
  @Get('/for-user')
  getAllForUser(@Query('userId') userId: string) {
    if (Number.isNaN(+userId)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.find({ user: { id: parseInt(userId) } });
  }

  @AdminAuth()
  @Get('/:id')
  getById(@Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.find({
      id: parseInt(id),
    });
  }

  @AdminAuth()
  @Delete('/:id')
  removeDevice(@Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.remove({
      id: parseInt(id),
    });
  }

  @AdminAuth()
  @Patch('/:id')
  updateDevice(
    @Query('userId') userId: string,
    @Param('id') id: string,
    @Body() body: UpdateDeviceDTO,
  ) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.update(
      {
        id: parseInt(id),
        user: { id: parseInt(userId) },
      },
      body,
    );
  }
}
