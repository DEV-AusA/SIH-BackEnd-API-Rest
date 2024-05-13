import { Controller, Param, Get, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('validate/:id')
  async verifyEmail(@Param('id') id: string, @Res() res: Response) {
    await this.emailService.verifyEmail(id);
    return res.redirect(`${process.env.FRONT_HOST_NAME}/ingreso`);
  }
}
