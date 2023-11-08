import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.model';
import { Action, Reaction } from './commands';

@Entity()
export class Payment {
  @PrimaryColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;
}
