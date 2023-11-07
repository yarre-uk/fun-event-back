import { Action, Reaction } from '../../../models/commands';

export class DeviceDTO {
  id: number;
  action: Action;
  reaction: Reaction;
  nfcData: string;
}
