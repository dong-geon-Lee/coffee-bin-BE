import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('이메일이 이미 존재합니다');
    if (password.length < 4) {
      throw new BadRequestException('패스워드는 4자 이상입니다');
    }

    return await this.usersService.create(email, password);
  }
}
