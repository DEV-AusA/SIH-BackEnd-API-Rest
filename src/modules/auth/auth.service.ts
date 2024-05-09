import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUserInfoDto } from './dto/google-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  async signUpUser(createUserDto: CreateUserDto) {
    const emailUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (emailUser)
      throw new BadRequestException(
        `Ya existe un usuario registrado con ese email.`,
      );

    const registerOk = await this.userService.signUpUser(createUserDto);
    return registerOk;
  }

  async singInUser(userLogin: LoginUserDto) {
    try {
      const emailValidate = await this.userService.searchEmail(userLogin.user);
      if (!emailValidate) return new BadRequestException('Email no encontrado');
      return emailValidate;
    } catch (error) {}
  }

  async validateUser(userData: GoogleUserInfoDto) {
    const { password } = userData;
    const user = await this.userRepository.findOneBy({ email: userData.email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      return user;
    } else {
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      return this.userRepository.save(newUser);
    }
  }

  async findUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }
}
