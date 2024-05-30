import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalFileInterceptorIMG } from 'src/interceptors/fileValidation.interceptor';
import { Role } from '../../helpers/roles.enum';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { UpdateUserGoogleDto } from './dto/update-user-google.dto';
import { UserIdInterceptor } from 'src/interceptors/validate-user-operations';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: 'd0058c20-fe42-4ed1-84e2-dabced0d2067',
          username: 'Martina.Mitchell',
          name: 'Miller',
          lastName: 'Renner',
          document: 38487922,
          image: 'https://avatars.githubusercontent.com/u/65076169',
          phone: null,
          cellphone: '748655630',
          email: 'Destany15@yahoo.com',
          validate: true,
          state: true,
          rol: 'owner',
          createdAt: '2024-01-04T03:03:35.239Z',
          lastLogin: '2024-05-29T15:37:02.727Z',
          properties: [
            {
              id: '1a628f9b-556d-4826-8a16-183714a3884e',
              number: 100,
              image:
                'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
              address: 'Calle 1 10',
              code: '1CH309',
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Error: Unauthorized',
    schema: {
      example: {
        message: 'No tienes permisos para el acceso a esa Ruta',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontraron usuarios',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Error: Unauthorized',
    schema: {
      example: {
        message: 'Necesitas loguearte para acceder a esta seccion.',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers() {
    return this.usersService.getUsersProps();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: '6d35ab63-dd4e-4a04-a875-a53148a1b4c1',
          username: 'security3',
          name: 'Daiana',
          lastName: 'Silva',
          document: 50123465,
          image:
            'https://res.cloudinary.com/dcqdilhek/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1716433107/mujer_1_ckbf8u.jpg',
          phone: null,
          cellphone: '1122334458',
          email: 'security3@gmail.com',
          validate: true,
          state: true,
          rol: 'security',
          createdAt: '2024-05-29T20:50:13.434Z',
          lastLogin: '2024-05-29T15:50:23.644Z',
          properties: [],
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontraron usuarios',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get('security')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsersSecurity() {
    return this.usersService.getUsersSecurity();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        id: 'f7a4d490-494b-49f3-9c5b-ffa957a50ca8',
        username: 'luis50',
        name: 'Luis',
        lastName: 'Hernandez',
        document: 50789016,
        image:
          'https://res.cloudinary.com/dcqdilhek/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1716433738/hombre4_juiesn.jpg',
        phone: null,
        cellphone: '1167890123',
        email: 'luis.hernandez@example.com',
        state: true,
        rol: 'owner',
        createdAt: '2024-05-29T20:55:55.617Z',
        lastLogin: '2024-05-29T15:56:04.554Z',
        properties: [
          {
            id: '0a2eed8d-e310-4483-bf15-dbedd724b24e',
            number: 100,
            image:
              'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
            address: 'Calle 1 10',
            code: '6F4609',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Error: Unauthorized',
    schema: {
      example: {
        message: 'No se puede obtener datos de ese usuario',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Usuario no encontrado',
      },
    },
  })
  @Get(':id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUser(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Usuario actualizado correctamente',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'ID invalida para la operacion solicitada',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Error: Unauthorized',
    schema: {
      example: {
        message: 'No tienes permisos para el acceso a esa Ruta',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @Put('update/:id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    UserIdInterceptor,
    FileInterceptor('file'),
    OptionalFileInterceptorIMG,
  )
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.updateUser(id, updateUserDto, file);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Usuario de Google actualizado correctamente',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'Por favor actualiza el Apellido',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'Por favor actualiza el número telefono celular',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'ID invalida para la operacion solicitada',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Put('update/google/:id')
  @Roles(Role.Admin, Role.GoogleTemp, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    UserIdInterceptor,
    FileInterceptor('file'),
    OptionalFileInterceptorIMG,
  )
  updateGoogleUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserGoogleDto: UpdateUserGoogleDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.updateUserGoogle(id, updateUserGoogleDto, file);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'El usuario fue dado de baja',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Error: Unauthorized',
    schema: {
      example: {
        message: 'No se puede dar de baja este usuario',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Usuario no encontrado',
      },
    },
  })
  @Put('unsubscribe/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  unsubscribeUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.unsubscribeUser(id);
  }
  @Put('subscribe/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  subscribeUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.subscribeUser(id);
  }
}
