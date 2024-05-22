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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorizations')
@Controller('authorizations')
export class AuthorizationsController {
  constructor(private readonly authorizationsService: AuthorizationsService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'El tipo de autorizacion ingresado no es correcto',
      },
    },
  })
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
  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.authorizationsService.findAllAuthorizations();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'No se encuentra una autorizacion con es numero ingresado.',
      },
    },
  })
  @Get(':number')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findOneAuthorization(@Param('number') id: string) {
    return this.authorizationsService.findOneAuthorization(Number(id));
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message: `Autorización validada con exito`,
      },
    },
  })
  @ApiResponse({
    status: 408,
    schema: {
      example: {
        statusCode: 408,
        message: `El código de autorization ha expirado, por favor genere otro.`,
      },
    },
  })
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message:
          'Autorización numero ${authorization.number} eliminada con éxito.',
      },
    },
  })
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteAuthorization(@Param('id', ParseUUIDPipe) id: string, number: number) {
    return this.authorizationsService.deleteAuthorization(id, number);
  }
}
