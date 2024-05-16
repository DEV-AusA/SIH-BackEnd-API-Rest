import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationsService } from './authorizations.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../helpers/roles.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

@Controller('authorizations')
export class AuthorizationsController {
  constructor(private readonly authorizationsService: AuthorizationsService) {}

  @Post(':id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createNewAuthorization(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createAuthorizationDto: CreateAuthorizationDto,
  ) {
    return this.authorizationsService.createAuthorization(
      id,
      createAuthorizationDto,
    );
  }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.authorizationsService.findAllAuthorizations();
  }

  @Get(':number')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findOneAuthorization(@Param('number') id: string) {
    return this.authorizationsService.findOneAuthorization(Number(id));
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Security, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  validateAuthorization(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorizationDto: UpdateAuthorizationDto,
  ) {
    return this.authorizationsService.validateAuthorization(
      id,
      updateAuthorizationDto,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteAuthorization(@Param('id', ParseUUIDPipe) id: string, number: number) {
    return this.authorizationsService.deleteAuthorization(id, number);
  }
}
