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

  signUpUser() {
    return;
  }

  signInUser() {
    return;
  }

  signInUpUserGoogle() {
    return;
  }
}
