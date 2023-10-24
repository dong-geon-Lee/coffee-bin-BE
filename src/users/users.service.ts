import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne({ where: { id } });
  }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('유저를 찾을수 없습니다');
    return this.repo.remove(user);
  }

  async update(id: number, body: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('유저를 찾을수 없습니다');

    if (body.email) user.email = body.email;
    if (body.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(body.password, salt);
      user.password = hashedPassword;
    }
    return this.repo.save(user);
  }
}
