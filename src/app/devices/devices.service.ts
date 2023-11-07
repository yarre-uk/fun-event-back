import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { Device } from '../../models/device.model';
import { User } from '../../models/user.model';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device) private repo: Repository<Device>,
    @InjectRepository(User) private repoUser: Repository<User>,
  ) {}

  create(user: User, entity: DeepPartial<Device>) {
    const createdEntity = this.repo.create({ ...entity, user });

    return this.repo.save(createdEntity);
  }

  findOne(options?: FindOptionsWhere<Device> | FindOptionsWhere<Device>[]) {
    if (!options) {
      return null;
    }

    return this.repo.findOneBy({ ...options, user: true });
  }

  find(options?: FindOptionsWhere<Device> | FindOptionsWhere<Device>[]) {
    if (!options) {
      return null;
    }

    return this.repo.find({ where: options, relations: { user: true } });
  }

  async update(
    options: FindOptionsWhere<Device> | FindOptionsWhere<Device>[],
    data: Partial<Device>,
  ) {
    const entity = await this.findOne(options);

    if (!entity) {
      throw new NotFoundException('Device not found');
    }

    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(
    options?: FindOptionsWhere<Device> | FindOptionsWhere<Device>[],
  ) {
    const entity = await this.findOne(options);

    if (!entity) {
      throw new NotFoundException(`Device wasn't found`);
    }

    return this.repo.remove(entity);
  }
}
