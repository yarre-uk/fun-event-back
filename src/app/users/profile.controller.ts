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
  @Serialize(UserDTO)
  async getProfile(@Req() request: AuthRequest) {
    const user = await this.usersService.findOne({
      id: request.user.id,
      devices: true,
    });

    return user;
  }

  @UseAuth()
  @Delete()
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @UseAuth()
  @Patch()
  updateUser(@Req() request: AuthRequest, @Body() body: UpdateUserDTO) {
    return this.usersService.update(request.user.id, body);
  }
}
