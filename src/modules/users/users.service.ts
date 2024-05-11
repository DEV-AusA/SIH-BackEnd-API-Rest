import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { emailBody } from '../utils/email-format';
import { config as dotenvConfig } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Property } from '../properties/entities/property.entity';

dotenvConfig({ path: '.env' });

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userService: Repository<User>,
    // @InjectRepository(Property)
    // private readonly propertyRepository: Repository<Property>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async getUsers(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return await this.userService.find({
      skip: start,
      take: end,
      select: [
        'id',
        'username',
        'name',
        'lastName',
        'document',
        'phone',
        'cellphone',
        'email',
        'image',
        'state',
        'rol',
        'createdAt',
        'lastLogin',
      ],
      relations: { properties: true },
    });
  }

  async getUser(id: string) {
    const userExists = await this.userService.find({
      where: { id: id },
      select: [
        'username',
        'name',
        'lastName',
        'document',
        'phone',
        'cellphone',
        'email',
        'image',
        'rol',
        'createdAt',
        'lastLogin',
      ],
    });
    if (!userExists) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return userExists;
  }

  async updateUser(id: string, updateUserDto: Partial<User>) {
    const userExists = await this.userService.findOneBy({ id: id });
    if (!userExists) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    // console.log(userExists);
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      userExists.password = updateUserDto?.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : userExists.password;
      // userExists.email = updateUserDto.email;
      userExists.username = updateUserDto?.username
        ? updateUserDto?.username
        : userExists.username;
      userExists.name = updateUserDto?.name
        ? updateUserDto?.name
        : userExists.name;
      userExists.lastName = updateUserDto?.lastName
        ? updateUserDto?.lastName
        : userExists.lastName;
      userExists.document = updateUserDto?.document
        ? updateUserDto?.document
        : userExists.document;
      userExists.phone = updateUserDto?.phone
        ? updateUserDto?.phone
        : userExists.phone;
      userExists.cellphone = updateUserDto?.cellphone
        ? updateUserDto?.cellphone
        : userExists.cellphone;
      // userExists.image = updateUserDto?.image;
      userExists.email = updateUserDto?.email
        ? updateUserDto?.email
        : userExists.email;
      console.log(userExists);
      const userModified = await queryRunner.manager.save(userExists);
      await queryRunner.manager.save(userModified);
      await queryRunner.commitTransaction();
      const registerOkMessage = {
        message: `Usuario actualizado correctamente`,
      };

      return registerOkMessage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async unsubscribeUser(id: string) {
    const userExists = await this.userService.findOneBy({ id: id });
    if (!userExists) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    userExists.state = false;
    await this.userService.save(userExists);
    return 'El usuario fue dado de baja';
  }
  async searchEmail(email: string) {
    return await this.userService.findOne({ where: { email: email } });
  }

  async searchUserName(username: string) {
    return await this.userService.findOne({ where: { username: username } });
  }

  async signUpUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 nivel hash
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      lastLogin: new Date(),
    };

    const emialPayload = {
      email: createUserDto.email,
    };
    const tokenEmailVerify = this.jwtService.sign(emialPayload, {
      expiresIn: '24h',
    });
    const urlValidate = `${process.env.HOST_NAME}/email/validate/${tokenEmailVerify}`;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = await queryRunner.manager.create(User, userData);
      const newUserSaved = await queryRunner.manager.save(newUser);

      const propFinded = await queryRunner.manager.findOneBy(Property, {
        code: userData.code,
      });
      if (!propFinded)
        throw new NotFoundException(
          'No existe una propiedad con ese Numero de identificacion.',
        );
      const propReg = await queryRunner.manager.preload(Property, {
        id: propFinded.id,
        user: newUserSaved,
      });
      await queryRunner.manager.save(propReg);

      await this.emailService.sendNewEmail({
        to: userData.email,
        subject: 'Bienvenido a SIH - Secure Ingress Home',
        text: emailBody(`${newUser.name} ${newUser.lastName}`, urlValidate),
      });

      await queryRunner.commitTransaction();
      const registerOkMessage = { message: `Usuario creado correctamente` };

      return registerOkMessage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  signInUser() {
    return;
  }

  signInUpUserGoogle() {
    return;
  }
}
