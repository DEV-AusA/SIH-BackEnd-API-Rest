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
  @ApiResponse({ status: 404, description: 'No se encontraron usuarios' })
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.getUsersProps(Number(page), Number(limit));
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'No se encontraron usuarios de Seguridad',
  })
  @Get('security')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsersSecurity() {
    return this.usersService.getUsersSecurity();
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({
    status: 401,
    description: 'No se puede obtener datos de ese usuario',
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
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No se puede actualizar este usuario',
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
    description: 'Usuario de Google actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede actualizar este usuario',
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
    description: 'El usuario fue dado de baja',
  })
  @ApiResponse({
    status: 401,
    description: 'No se puede dar de baja este usuario',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Put('unsubscribe/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  unsubscribeUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.unsubscribeUser(id);
  }
}
