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
    status: 201,
    description: 'Created',
    schema: {
      example: {
        user: 'd6ad3fe7-d313-448e-bae6-1ea4427b0fcd',
        type: 'guest',
        name: 'Fernando Perez',
        document: 50345678,
        shipmentNumber: null,
        accessCode: '5678',
        expirationTime: '2024-05-23T05:32:19.022Z',
        dateGenerated: '2024-05-23T03:32:19.023Z',
        guardId: null,
        dateUsed: null,
        id: '778b058a-8062-4782-8ac9-7c2572541c9c',
        number: 1,
        nameProp: 'Leonardo',
        lastNameProp: 'Ausa',
        numberProp: 158,
        addressProp: 'Calle 6 143',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      example: {
        user: '5ccae5a2-62fa-420f-8fa8-7c1ac211ef3e',
        type: 'delivery',
        name: 'Amazon',
        document: 50345587,
        shipmentNumber: '4828',
        accessCode: '2348',
        expirationTime: '2024-05-23T05:34:53.763Z',
        dateGenerated: '2024-05-23T03:34:53.764Z',
        guardId: null,
        dateUsed: null,
        id: '315fa4ad-aa39-42f4-bf04-ff0eeb555036',
        number: 1,
        nameProp: 'Leonardo',
        lastNameProp: 'Ausa',
        numberProp: 158,
        addressProp: 'Calle 6 143',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'El tipo de autorizacion ingresado no es correcto',
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
        message: 'No tienes ninguna propiedad vinculada a tu cuenta',
        error: 'Not Found',
        statusCode: 404,
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
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      example: [
        {
          id: 'ac424e1e-7405-4b79-966a-79c4acc15969',
          number: 1,
          user: '781c1a70-4b57-4c42-b629-b1c531183639',
          type: 'guest',
          name: 'Fernando Perez',
          document: 50345678,
          shipmentNumber: '5678',
          accessCode: 9493,
          expirationTime: '2024-05-23T05:48:37.754Z',
          dateGenerated: '2024-05-23T03:48:37.755Z',
          guardId: null,
          dateUsed: null,
        },
      ],
    },
  })
  @Get()
  @Roles(Role.Admin, Role.Security, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.authorizationsService.findAllAuthorizations();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: '848b9b28-6403-4011-b658-d9a44c511ae6',
          number: 1,
          user: 'ce9b2f6a-a4b2-48a9-a566-4655068f309d',
          type: 'guest',
          name: 'Fernando Perez',
          document: 50345678,
          shipmentNumber: '5678',
          accessCode: '9956',
          expirationTime: '2024-05-26T19:04:51.760Z',
          dateGenerated: '2024-05-26T17:04:51.761Z',
          guardId: null,
          dateUsed: null,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      example: {
        message: 'No se encuentra una autorizacion con el código ingresado.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get('user/:id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findAllByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorizationsService.findAllAuthorizationsByUser(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        id: 'a392a02f-26a8-4af8-b6c4-49743c411449',
        number: 1,
        user: '0245667f-edc2-439c-a249-bf14687e4ebc',
        type: 'delivery',
        name: 'Fernando Perez',
        document: null,
        shipmentNumber: '4828',
        accessCode: '2218',
        expirationTime: '2024-05-28T01:15:29.933Z',
        dateGenerated: '2024-05-27T23:15:29.934Z',
        guardId: null,
        dateUsed: null,
        nameProp: 'Leonardo',
        lastNameProp: 'Ausa',
        numberProp: 160,
        addressProp: 'Calle 0 41',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      example: {
        message: 'No se encuentra una autorizacion con el código ingresado.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get(':code')
  @Roles(Role.Admin, Role.SuperAdmin, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  findOneAuthorization(@Param('code') code: string) {
    return this.authorizationsService.findOneAuthorization(code);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: `Autorización validada con exito`,
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: `El código de autorization ha expirado, por favor genere otro.`,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: `No se encuentra una autorizacion con ese numero ingresado.`,
        error: 'Not Found',
        statusCode: 404,
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
    description: 'OK',
    schema: {
      example: {
        message:
          'Autorización numero ${authorization.number} eliminada con éxito.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encuentra una autorizacion con es numero ingresado.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteAuthorization(@Param('id', ParseUUIDPipe) id: string, code: string) {
    return this.authorizationsService.deleteAuthorization(id, code);
  }
}
