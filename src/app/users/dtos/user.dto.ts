import { Expose } from 'class-transformer';
import { Device } from '../../../models/device.model';

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  devices: Device[];
}
