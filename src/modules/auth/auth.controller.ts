import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { GoogleAuthGuard } from '../../guards/google-guard.guard';
import { Request } from 'express';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        username: 'juanperez14',
        password: 'Password123!',
        name: 'Juan Pérez',
        lastName: 'Juan Pérez',
        document: 12345678,
        phone: 1234567890,
        cellphone: 1234567890,
        email: 'usuario@example.com',
        code: 'codigo de la vivienda proporcionado por el admin ',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ya existe un usuario registrado con ese email.',
  })
  @Post('signup')
  signUpUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        token:
          'eyGhyGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        user: {
          id: '850c3059-1314-4eab-8a9e-1fe88d32ed13',
          username: 'juanperez14',
          name: 'Juan',
          lastName: 'Perez',
          document: 123456789,
          image:
            'https://res.cloudinary.com/dcqdilhek/image/upload/fl_preserve_transparency/v1715136207/zmuncvwsnlws77vegwxq.jpg',
          phone: null,
          cellphone: 123456789,
          email: 'usuario@example.com',
          rol: 'owner',
          lastLogin: '2024-05-18T01:33:25.027Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Algun dato ingresado es incorrecto',
  })
  @HttpCode(200)
  @Post('signin')
  signInUser(@Body() userLogin: LoginUserDto) {
    return this.authService.singInUser(userLogin);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return {
      msg: 'Google Authentication',
    };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async loginOk(@Req() request: Request, @Res() res: Response) {
    const encodedData = encodeURIComponent(JSON.stringify(request.user));
    res.redirect(
      `${process.env.FRONT_HOST_NAME}/api/google?state=${encodedData}`,
    );
    return 'Redirigiendo';
  }

  @Get('status')
  userStatus(@Req() request: Request) {
    if (request) {
      console.log(request.user);
      return { msg: request.user, status: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
