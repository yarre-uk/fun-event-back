import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { AdminAuth } from '../../decorators/auth';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @AdminAuth()
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    if (Number.isNaN(+id)) {
      return new Error('id is not a number');
    }

    const user = await this.usersService.findOne({ id: parseInt(id) });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @AdminAuth()
  @Get()
  findAllUsers() {
    return this.usersService.find({});
  }

  @AdminAuth()
  @Get('/by-email')
  findUsersByEmail(@Query('email') email: string) {
    return this.usersService.find({ email });
  }

  @AdminAuth()
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @AdminAuth()
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.update(parseInt(id), body);
  }
}
