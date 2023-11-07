import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Action, Reaction } from './commands';

@Entity()
export class Device {
  @PrimaryColumn()
  id: number;

  @Column({ default: '' })
  action: Action;

  @Column({ default: '' })
  reaction: Reaction;

  @Column({ default: '' })
  nfcData: string;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => User, (user) => user.devices)
  user: User;
}
