import { IsNumber } from 'class-validator';

export class ApproveDeviceDTO {
  @IsNumber()
  id: number;
}
