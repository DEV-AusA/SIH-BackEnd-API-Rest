import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async verifyEmail(id: string) {
    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(id, { secret });

      const userFinded = await this.userRepository.findOneBy({
        email: payload.email,
      });

      if (!userFinded)
        throw new NotFoundException('El usuario con ese mail no existe');
      const user = await this.userRepository.preload({
        ...userFinded,
        validate: true,
      });
      await this.userRepository.save(user);

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `Token de Email invalido o se encuentra vencido`,
      );
    }
  }

  async sendNewEmail(createEmailDto: CreateEmailDto) {
    try {
      await this.mailService.sendMail({
        to: createEmailDto.to,
        subject: createEmailDto.subject,
        html: createEmailDto.text,
      });
      return { message: 'Email enviado con exito' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al enviar el Email', error);
    }
  }
}
