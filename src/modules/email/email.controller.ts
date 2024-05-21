import { Controller, Param, Get, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Email Verification')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiResponse({
    status: 200,
    description:
      'Se envia el email de verificacion y despues de confirmado, se valida el usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de Email invalido o se encuentra vencido',
  })
  @ApiResponse({
    status: 404,
    description: 'El usuario con ese mail no existe',
  })
  @Get('validate/:id')
  async verifyEmail(@Param('id') id: string, @Res() res: Response) {
    await this.emailService.verifyEmail(id);
    return res.redirect(`${process.env.FRONT_HOST_NAME}/ingreso`);
  }
}
