import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  signUpUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
