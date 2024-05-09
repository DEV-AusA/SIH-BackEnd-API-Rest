import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '../../config/nodemailer.config';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
