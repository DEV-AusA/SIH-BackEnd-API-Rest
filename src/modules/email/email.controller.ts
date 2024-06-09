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
        message: true,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Error: Unauthorized',
    schema: {
      example: {
        message: 'Token de Email invalido o se encuentra vencido',
        error: 'Unauthorized',
        statusCode: 401,
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

  @Get('recovery')
  async verifyRecovery(@Param('token') token: string, @Res() res: Response) {
    const tokenRecovery = await this.emailService.verifyEmailRecovery(token);
    const encodedData = encodeURIComponent(JSON.stringify(tokenRecovery));

    return res.redirect(
      `${process.env.FRONT_HOST_NAME}/ingreso/recupero?recovery=${encodedData}`,
    );
  }
}
