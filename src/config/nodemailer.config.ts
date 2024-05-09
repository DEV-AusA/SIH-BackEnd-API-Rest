import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.HOST_PROVIDER,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  },
  defaults: {
    from: '"No responder" <no-reply@localhost>',
  },
  preview: true,
  template: {
    dir: process.cwd() + '/template/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
