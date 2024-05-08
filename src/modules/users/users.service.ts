import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userService: Repository<User>,
  ) {}

  async searchEmail(email: string) {
    return await this.userService.findOne({ where: { email: email } });
  }

  signInUser() {
    return;
  }

  signInUpUserGoogle() {
    return;
  }
}
