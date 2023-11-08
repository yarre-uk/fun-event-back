import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';

export function AdminAuth() {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    Roles('Admin')(target, key, descriptor);
    UseGuards(AuthGuard)(target, key, descriptor);
  };
}

export function UseAuth() {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    UseGuards(AuthGuard)(target, key, descriptor);
  };
}