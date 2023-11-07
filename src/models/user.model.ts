import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './roles';
import { Device } from './device.model';

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

  @OneToMany(() => Device, (device) => device.user, { cascade: true })
  devices: Device[];
}
