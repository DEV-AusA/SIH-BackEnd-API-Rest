import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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
    const emailValidate = await this.userService.searchEmail(userLogin.user);
    const usernameValidate = await this.userService.searchUserName(
      userLogin.user,
    );
    if (!emailValidate && !usernameValidate)
      throw new HttpException(
        'Email o Username no encontrado',
        HttpStatus.NOT_FOUND,
      );

    const userValidated = emailValidate ? emailValidate : usernameValidate;
    // const passwordValidate = bcrypt.compare(
    //   userLogin.password,
    //   userValidated.password,
    // );
    if (!(userLogin.password === userValidated.password)) {
      throw new HttpException('Contraseña incorrecta', HttpStatus.NOT_FOUND);
    }
    // if (!passwordValidate)
    //   return new BadRequestException('Contraseña incorrecta');

    const payload = {
      id: userValidated.id,
      email: userValidated.email,
      rol: userValidated.rol,
    };
    const token = this.jwtService.sign(payload);
    return {
      token: token,
      user: {
        username: userValidated.username,
        name: userValidated.name,
        lastName: userValidated.lastName,
        document: userValidated.document,
        image: userValidated.image,
        phone: userValidated.phone,
        cellphone: userValidated.cellphone,
        email: userValidated.email,
        rol: userValidated.rol,
        lastLogin: userValidated.lastLogin,
      },
    };
    // return userLogin;
    // if (!emailValidate) return new BadRequestException('Email no encontrado');
  }
}
