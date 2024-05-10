import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userService: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async getUsers(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return await this.userService.find({
      skip: start,
      take: end,
      select: [
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

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = await queryRunner.manager.create(User, userData);
      await queryRunner.manager.save(newUser);
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
