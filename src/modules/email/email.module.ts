import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '../../config/nodemailer.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    MailerModule.forRoot(mailerConfig),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
