import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
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

    const dniUser = await this.userRepository.findOneBy({
      document: createUserDto.document,
    });
    if (dniUser)
      throw new BadRequestException(
        `Ya existe un usuario registrado con ese documento.`,
      );

    const username = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (username)
      throw new BadRequestException(
        `Ya existe un usuario registrado con ese nombre de usuario.`,
      );

    const propLinked = await this.propertyRepository.findOne({
      where: {
        code: createUserDto.code,
      },
      relations: ['user'],
    });
    if (!propLinked)
      throw new NotFoundException(
        'No existe una propiedad con ese codigo ingresado',
      );
    if (propLinked.user)
      throw new ConflictException(
        'El codigo de propiedad ya está vinculado a otro usuario',
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
    if (!passwordValidate)
      throw new BadRequestException('Algun dato ingresado es incorrecto');

    await this.userRepository.update(
      {
        id: userValidated.id,
      },
      { lastLogin: new Date() },
    );

    const payload = {
      id: userValidated.id,
      email: userValidated.email,
      rol: userValidated.rol,
    };
    const token = this.jwtService.sign(payload);
    const userLoginData = {
      token: token,
      user: {
        id: userValidated.id,
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
        properties: userValidated.properties,
      },
    };
    return userLoginData;
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
        rol: 'googletemp',
      });
      return this.userRepository.save(newUser);
    }
  }
}
