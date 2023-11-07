import { IsString } from 'class-validator';
import { Action, Reaction } from '../../../models/commands';

export class UpdateDeviceDTO {
  action: Action;
  reaction: Reaction;

  @IsString()
  nfcData: string;
}
