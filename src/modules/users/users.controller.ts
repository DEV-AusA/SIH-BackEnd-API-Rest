import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
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
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 3) {
    return this.usersService.getUsers(Number(page), Number(limit));
  }

  @ApiBearerAuth()
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
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
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
}
