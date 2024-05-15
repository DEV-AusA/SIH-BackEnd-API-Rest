import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { emailBody } from '../../utils/email-format';
import { config as dotenvConfig } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Property } from '../properties/entities/property.entity';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';
import { Role } from '../../helpers/roles.enum';

dotenvConfig({ path: '.env' });

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userService: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
    private readonly filesCloudinaryService: FilesCloudinaryService,
  ) {}

  async getUsers(page: number, limit: number) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return await this.userService.find({
      skip: start,
      take: end,
      where: { rol: Not(Role.SuperAdmin) },
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
        'validate',
      ],
      relations: { properties: true },
    });
  }

  async getUser(id: string) {
    const userExists = await this.userService.findOne({
      where: { id: id },
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
    });
    if (!userExists) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (userExists.rol === 'superadmin')
      throw new UnauthorizedException(
        'No se puede obtener datos de ese usuario',
      );
    return userExists;
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<User>,
    file: Express.Multer.File,
  ) {
    const userExists = await this.userService.findOneBy({ id: id });
    if (!userExists) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (userExists.rol === 'superadmin')
      throw new UnauthorizedException('No se puede modificar ese usuario');

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (file?.buffer) {
        if (
          userExists.image !==
          'https://res.cloudinary.com/dcqdilhek/image/upload/fl_preserve_transparency/v1715136207/zmuncvwsnlws77vegwxq.jpg'
        ) {
          const publicId = await this.filesCloudinaryService.obtainPublicId(
            userExists.image,
          );
          await this.filesCloudinaryService.deleteFile(publicId);
        }
      }
      const uploadedImage = file?.buffer
        ? await this.filesCloudinaryService.createFile(file)
        : null;
      updateUserDto.image = file?.buffer
        ? uploadedImage?.secure_url
        : userExists.image;
      updateUserDto.password = updateUserDto?.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : userExists.password;

      const user = await queryRunner.manager.preload(User, {
        id,
        ...updateUserDto,
      });
      const userModified = await queryRunner.manager.save(user);
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
    if (userExists.rol === 'superadmin')
      throw new UnauthorizedException('No se puede dar de baja ese usuario');
    userExists.state = false;
    await this.userService.save(userExists);
    return { message: 'El usuario fue dado de baja' };
  }
  async searchEmail(email: string) {
    return await this.userService.findOne({ where: { email: email } });
  }

  async searchUserName(username: string) {
    return await this.userService.findOne({ where: { username: username } });
  }

  async findUserById(id: string) {
    const user = await this.userService.findOneBy({ id });
    if (!user) throw new NotFoundException('No existe un usuario con ese id');
    return user;
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
      rol: 'owner',
    };
    const tokenEmailVerify = this.jwtService.sign(emialPayload, {
      expiresIn: '24h',
    });
    const urlValidate = `${process.env.BACK_HOST_NAME}/email/validate/${tokenEmailVerify}`;

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
}
