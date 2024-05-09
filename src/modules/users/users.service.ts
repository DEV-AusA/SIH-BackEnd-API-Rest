import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { emailBody } from '../utils/email-format';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userService: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async searchEmail(email: string) {
    return await this.userService.findOne({ where: { email: email } });
  }

  async signUpUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 nivel hash
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      lastLogin: new Date(),
    };

    const linkTemp = 'http://localhost:3000/auth/google/redirect';

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = await queryRunner.manager.create(User, userData);
      await queryRunner.manager.save(newUser);
      const emailSend = await this.emailService.sendNewEmail({
        to: userData.email,
        subject: 'Bienvenido a SIH - Secure Ingress Home',
        text: emailBody(`${newUser.name} ${newUser.lastName}`, linkTemp),
      });

      console.log(emailSend);
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
