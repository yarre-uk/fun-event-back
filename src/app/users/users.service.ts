import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../shared/models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(user: DeepPartial<User>) {
    const userEntity = this.repo.create(user);

    return this.repo.save(userEntity);
  }

  findOne(options?: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    if (!options) {
      return null;
    }

    return this.repo.findOneBy(options);
  }

  find(options?: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    if (!options) {
      return null;
    }

    return this.repo.find({ where: options });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
