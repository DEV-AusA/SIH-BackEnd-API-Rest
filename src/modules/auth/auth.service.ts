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
import { GoogleUserInfoDto } from './dto/google-auth.dto';
import * as bcrypt from 'bcrypt';
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
        'Algun dato ingresado es incorrecto',
        HttpStatus.NOT_FOUND,
      );

    const userValidated = emailValidate ? emailValidate : usernameValidate;
    if (!userValidated.state)
      throw new HttpException('Cuenta Dada de Baja', HttpStatus.NOT_FOUND);

    if (!userValidated.validate)
      throw new HttpException(
        'Cuenta Inactiva. Verifique su correo',
        HttpStatus.NOT_FOUND,
      );

    const passwordValidate = await bcrypt.compare(
      userLogin.password,
      userValidated.password,
    );
    console.log(passwordValidate);
    if (!passwordValidate)
      return new BadRequestException('Algun dato ingresado es incorrecto');

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
