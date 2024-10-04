import { UserRepo } from '@nestjs-demo/app/port/repo/user.repo';
import { UserPo } from '@nestjs-demo/infra/po/user.po';
import { User } from '@nestjs-demo/domain/entity/user';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserMapper } from 'helper/util/mapper/user.po.mapper';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class UserRepoImpl implements UserRepo {
  constructor(
    @InjectRepository(UserPo)
    private readonly userOrmRepo: Repository<UserPo>,
  ) {}

  async deleteById(id: string): Promise<void> {
    const result = await this.userOrmRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async update(user: User): Promise<void> {
    const existingUser = await this.userOrmRepo.findOne({ where: { id: user.id } });
    if (!existingUser)
      throw new NotFoundException(`User with ID ${user.id} not found`);

    const updatedUserPo = UserMapper.toUserPo(user);
    await this.userOrmRepo.save(updatedUserPo);
  }

  async save(user: User): Promise<void> {
    const userPo = new UserPo();
    userPo.id = user.id;
    userPo.name = user.name;
    userPo.email = user.email;
    await this.userOrmRepo.save(userPo);
  }

  async findById(id: string): Promise<User | null> {
    const userPo = await this.userOrmRepo.findOne({ where: { id } });
    if (!userPo) 
      return null;

    return UserMapper.fromUserPo(userPo);
  }
}
