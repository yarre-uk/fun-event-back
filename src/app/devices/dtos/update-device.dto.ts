import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Action, Reaction } from '../../../models/commands';

export class UpdateDeviceDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  action: Action;

  @IsOptional()
  reaction: Reaction;

  @IsString()
  @IsOptional()
  nfcData: string;
}
