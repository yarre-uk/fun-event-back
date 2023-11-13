import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { UseAuth } from '../../decorators/auth';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { UserDTO } from './dtos/user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('profile')
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @UseAuth()
  @Get()
  async getProfile(@Req() request: AuthRequest) {
    const user = await this.usersService.findOne({
      id: request.user.id,
      devices: true,
    });

    delete user.password;
    delete user.role;

    return user;
  }

  @UseAuth()
  @Delete()
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @UseAuth()
  @Patch()
  async updateUser(@Req() request: AuthRequest, @Body() body: UpdateUserDTO) {
    const user = await this.usersService.update(request.user.id, body);

    delete user.password;
    delete user.role;

    return user;
  }

  @UseAuth()
  @Get('has-lost-devices')
  userHasLostDevices(@Req() request: AuthRequest) {
    return this.usersService.userHasLostDevices(request.user.id);
  }
}
