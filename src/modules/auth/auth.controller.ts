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
    schema: {
      example: {
        statusCode: 400,
        message: 'Ya existe un usuario registrado con ese email.',
      },
    },
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
    schema: {
      example: {
        statusCode: 401,
        message: 'Algun dato ingresado es incorrecto',
      },
    },
  })
  @HttpCode(200)
  @Post('signin')
  signInUser(@Body() userLogin: LoginUserDto) {
    return this.authService.singInUser(userLogin);
  }

  @ApiResponse({
    description: 'Este es el que ejecuta el OAuth2.0 de Google',
  })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return {
      msg: 'Google Authentication',
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Esta es la data que regresa en el login con Google',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiN…Dc3fQ.n9kY8nZzlkN9eer8mNV5WeXdHt8GEeoskErCureRHe8',
        user: {
          id: 'bb6b482e-a7a3-4e72-962b-a87f3015b746',
          username: 'tester1',
          name: 'Tester',
          lastName: 'Si tiene se le va el apellido sino va Google',
          document: 50123457,
          image:
            'https://res.cloudinary.com/dcqdilhek/image/upload/fl_preserve_transparency/v1715136207/zmuncvwsnlws77vegwxq.jpg',
          phone: null,
          cellphone: '1122334455',
          email: 'tester1@gmail.com',
          googleAccount: true,
          rol: 'inicialmente es googletemp => hasta que actualice los datos',
          lastLogin: '2024-05-21T00:01:56.767Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'No se pudo iniciar sesion con Google',
      },
    },
  })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async loginOk(@Req() request: Request, @Res() res: Response) {
    const encodedData = encodeURIComponent(JSON.stringify(request.user));
    res.redirect(
      `${process.env.FRONT_HOST_NAME}/api/google?state=${encodedData}`,
    );
    return 'Redirigiendo';
  }
}
