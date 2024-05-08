import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  signUpUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  async singInUser(userLogin: LoginUserDto) {
    try {
      const emailValidate = await this.userService.searchEmail(userLogin.user);
      if (!emailValidate) return new BadRequestException('Email no encontrado');
      return emailValidate;
    } catch (error) {}
  }
}
