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
    schema: {
      example: {
        statusCode: 200,
        message:
          'Se envia el email de verificacion y despues de confirmado, se valida el usuario',
      },
    },
  })
  @ApiResponse({
    status: 401,
    schema: {
      example: {
        statusCode: 401,
        message: 'Token de Email invalido o se encuentra vencido',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'El usuario con ese mail no existe',
      },
    },
  })
  @Get('validate/:id')
  async verifyEmail(@Param('id') id: string, @Res() res: Response) {
    await this.emailService.verifyEmail(id);
    return res.redirect(`${process.env.FRONT_HOST_NAME}/ingreso`);
  }
}
