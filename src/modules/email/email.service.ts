import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendNewEmail(createEmailDto: CreateEmailDto) {
    console.log(createEmailDto);
    try {
      const emailSend = await this.mailService.sendMail({
        to: createEmailDto.to,
        subject: createEmailDto.subject,
        html: createEmailDto.text,
      });
      console.log(emailSend);

      return { message: 'Email enviado con exito' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al enviar el Email', error);
    }
  }
}
