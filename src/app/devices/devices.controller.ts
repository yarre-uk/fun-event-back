import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UseAuth } from '../../decorators/auth';
import { DevicesService } from './devices.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { CreateDeviceDTO } from './dtos/create-device.dto';
import { ApproveDeviceDTO } from './dtos/approve-device.dto';
import { LostDeviceDTO } from './dtos/lost-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}

  @UseAuth()
  @Post()
  async addDevice(
    @Request() req: AuthRequest,
    @Body() createDeviceDTO: CreateDeviceDTO,
  ) {
    return this.deviceService.addDevice(createDeviceDTO, req.user);
  }

  @Post('/approve')
  async approveDevice(@Body() approveDeviceDTO: ApproveDeviceDTO) {
    return this.deviceService.approveDevice(approveDeviceDTO);
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

  @Get('/for-device/:id')
  getDataForDevice(@Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    return this.deviceService.getDataForDevice(parseInt(id));
  }

  @Post('/for-device/:id')
  setTurnOff(@Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('Id is not a number');
    }

    this.deviceService.turnOffDevice(parseInt(id));
  }

  @Post('/device-lost/:id')
  setDeviceIsLost(@Body() lostDTO: LostDeviceDTO) {
    return this.deviceService.lostDevice(lostDTO);
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
  updateDevice(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: LostDeviceDTO,
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
