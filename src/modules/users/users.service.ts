import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, In, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { emailNewRegister } from '../../utils/email-new-register';
import { config as dotenvConfig } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Property } from '../properties/entities/property.entity';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';
import { Role } from '../../helpers/roles.enum';
import { UpdateUserGoogleDto } from './dto/update-user-google.dto';
import { emailUserDisable } from '../../utils/email-user-disable';

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

  async getUsersProps() {
    const users = await this.userService.find({
      where: { rol: Not(In([Role.SuperAdmin, Role.Admin, Role.Security])) },
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

    if (!users) throw new NotFoundException('No se encontraron usuarios');
    return users;
  }

  async getUsersSecurity() {
    const usersSecurity = await this.userService.find({
      where: { rol: 'security' },
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

    if (!usersSecurity)
      throw new NotFoundException('No se encontraron usuarios');
    return usersSecurity;
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

  async updateUserGoogle(
    id: string,
    updateUserGoogleDto: UpdateUserGoogleDto,
    file: Express.Multer.File,
  ) {
    const userExists = await this.userService.findOneBy({ id });
    if (!userExists) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (updateUserGoogleDto.lastName === 'Google')
      throw new BadRequestException('Por favor actualiza el Apellido');

    if (updateUserGoogleDto.cellphone === 6000000613)
      throw new BadRequestException(
        'Por favor actualiza el número telefono celular',
      );

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const propFinded = await queryRunner.manager.findOneBy(Property, {
        code: updateUserGoogleDto.code,
      });
      if (!propFinded)
        throw new NotFoundException(
          'No existe una propiedad con ese Numero de identificacion.',
        );
      const propReg = await queryRunner.manager.preload(Property, {
        id: propFinded.id,
        user: userExists,
      });
      await queryRunner.manager.save(propReg);

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

      const image = file?.buffer ? uploadedImage?.secure_url : userExists.image;

      const password = updateUserGoogleDto?.password
        ? await bcrypt.hash(updateUserGoogleDto.password, 10)
        : userExists.password;

      const user = await queryRunner.manager.preload(User, {
        id,
        ...updateUserGoogleDto,
        rol: 'owner',
        password,
        image,
      });
      const userModified = await queryRunner.manager.save(user);
      await queryRunner.manager.save(userModified);
      await queryRunner.commitTransaction();
      const registerOkMessage = {
        message: `Usuario de Google actualizado correctamente`,
      };

      return registerOkMessage;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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

    const dniExists = await this.userService.findOneBy({
      document: updateUserDto.document,
    });
    if (updateUserDto?.document) {
      if (dniExists && userExists.document !== updateUserDto.document)
        throw new NotFoundException('El DNI ya existe');
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
      const userUpdatedOkMessage = {
        message: `Usuario actualizado correctamente`,
      };

      return userUpdatedOkMessage;
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
    const userDisabled = await this.userService.save(userExists);

    await this.emailService.sendNewEmail({
      to: userDisabled.email,
      subject: 'Alerta de cuenta - Secure Ingress Home',
      text: emailUserDisable(`${userDisabled.name} ${userDisabled.lastName}`),
    });
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
      let newUserSaved: User;
      if (createUserDto.code === 'SIHSECURITY') {
        const newUser = await queryRunner.manager.create(User, {
          ...userData,
          rol: 'security',
        });
        newUserSaved = await queryRunner.manager.save(newUser);
      } else {
        const newUser = await queryRunner.manager.create(User, userData);
        newUserSaved = await queryRunner.manager.save(newUser);

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
      }

      await this.emailService.sendNewEmail({
        to: userData.email,
        subject: 'Bienvenido a SIH - Secure Ingress Home',
        text: emailNewRegister(
          `${newUserSaved.name} ${newUserSaved.lastName}`,
          urlValidate,
        ),
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

  async findUsersProps() {
    const excludedRoles = ['security', 'admin', 'superadmin'];
    const users = await this.userService.find({
      where: { rol: Not(In(excludedRoles)) },
      select: ['id', 'name'],
    });

    return users;
  }
}
