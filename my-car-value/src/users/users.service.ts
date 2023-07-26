import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  createUser(userData: { email: string; password: string }) {
    const user = this.userRepo.create(userData);

    return this.userRepo.save(user);
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return this.userRepo.save(Object.assign(user, attributes));
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return this.userRepo.remove(user);
  }
}
