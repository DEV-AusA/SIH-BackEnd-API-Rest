import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
  HttpCode,
  Param,
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
    description: 'Created',
    schema: {
      example: {
        message: 'Usuario creado correctamente',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'Ya existe un usuario registrado con ese email.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Post('signup')
  signUpUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpUser(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'OK',
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
          properties: [
            {
              id: 'a5a0b0c0-5b0b-4a0b-8a0b-1a0b8a0b8a0b',
              number: 109,
              image:
                'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
              address: 'Calle 9 10',
              code: 'CDAH3E',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'Algun dato ingresado es incorrecto',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Cuenta Inactiva. Verifique su correo',
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
    description: 'OK -Esta es la data que regresa en el login con Google',
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
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'No se pudo iniciar sesion con Google',
        error: 'Bad Request',
        statusCode: 400,
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

  @Post('signin/recovery/:email')
  signInUserRecovery(@Param('email') email: string) {
    return this.authService.recoveryPassword(email);
  }
}
