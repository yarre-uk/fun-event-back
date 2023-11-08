import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './roles';
import { Device } from './device.model';
import { Payment } from './payment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'Admin' })
  role: Role;

  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments: Payment[];

  @OneToMany(() => Device, (device) => device.user, { cascade: true })
  devices: Device[];
}
