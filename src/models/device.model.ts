import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.model';
import { Action, Reaction } from './commands';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: Action;

  @Column()
  reaction: Reaction;

  @Column()
  nfcData: string;

  @Column()
  approved: boolean;

  @ManyToOne(() => User, (user) => user.devices)
  user: User;
}
