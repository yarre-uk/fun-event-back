import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UseAuth } from '../../decorators/auth';
import { DevicesService } from './devices.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { UpdateDeviceDTO } from './dtos/update-device.dto';
import { CreateDeviceDTO } from './dtos/create-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}

  @UseAuth()
  @Post()
  async addDevice(
    @Request() req: AuthRequest,
    @Body() createDeviceDTO: CreateDeviceDTO,
  ) {
    const entityWithId = await this.deviceService.findOne({
      id: createDeviceDTO.id,
      user: { id: req.user.id },
    });

    console.log(req.user);

    if (!!entityWithId) {
      throw new ForbiddenException();
    }

    return this.deviceService.create(req.user.data, {
      id: createDeviceDTO.id,
      user: { id: req.user.id },
    });
  }

  @UseAuth()
  @Get()
  getAll(@Request() req: AuthRequest) {
    return this.deviceService.find({ user: { id: req.user.id } });
  }

  @UseAuth()
  @Get('/:id')
  getById(@Request() req: AuthRequest, @Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.find({
      id: parseInt(id),
      user: { id: req.user.id },
    });
  }

  @UseAuth()
  @Delete('/:id')
  removeDevice(@Request() req: AuthRequest, @Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.remove({
      id: parseInt(id),
      user: { id: req.user.id },
    });
  }

  @UseAuth()
  @Patch('/:id')
  updateUser(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: UpdateDeviceDTO,
  ) {
    return this.deviceService.update(
      {
        id: parseInt(id),
        user: { id: req.user.id },
      },
      body,
    );
  }
}
