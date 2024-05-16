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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 3) {
    return this.usersService.getUsers(Number(page), Number(limit));
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUser(id);
  }

  @Put('update/:id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'), OptionalFileInterceptorIMG)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.updateUser(id, updateUserDto, file);
  }

  @Put('unsubscribe/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  unsubscribeUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.unsubscribeUser(id);
  }
}
