import { Reflector } from '@nestjs/core';
import { Role } from '../models/roles';

export const Roles = Reflector.createDecorator<Role>();
