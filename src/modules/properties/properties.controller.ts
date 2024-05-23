import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DeletePropertyDto } from './dto/delete-property.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalFileInterceptorIMG } from '../../interceptors/fileValidation.interceptor';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../helpers/roles.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { UserIdInterceptor } from 'src/interceptors/validate-user-operations';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Created',
    schema: {
      example: {
        number: 111,
        image:
          'https://static.tokkobroker.com/pictures/54875686735059677368693141545969812663641450316300492212526170802494178142272.jpg',
        address: '123 Main Streets',
        ubication: 'https://maps.app.goo.gl/dosYom2qmP2Y3YBu7',
        code: '3B9630',
        id: 'dbc8dac2-d3ee-4d6f-a85c-624b7e3e3ecd',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: 'Ya existe una propiedad con ese codigo de identificacion',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Error: Conflict',
    schema: {
      example: {
        message: 'Ya existe una propiedad con ese numero de identificacion',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @Post('create')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createNewProperty(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.createProperty(createPropertyDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: '54ed39c0-aaf0-4e9b-9dad-047bd44803b1',
          number: 100,
          image:
            'https://static.tokkobroker.com/pictures/54875686735059677368693141545969812663641450316300492212526170802494178142272.jpg',
          address: 'Calle 1 - 10',
          ubication: 'https://maps.app.goo.gl/dosYom2qmP2Y3YBu7',
          code: '4JA8GC',
        },
        {
          id: 'f547fa3a-8b5b-4d94-a280-7d07d08e1c91',
          number: 101,
          image:
            'https://static.tokkobroker.com/pictures/77887018768743634186372733558918842141817144857098180195480223189260552937506.jpg',
          address: 'Calle 1 - 11',
          ubication: 'https://maps.app.goo.gl/dosYom2qmP2Y3YBu7',
          code: '69E296',
        },
      ],
    },
  })
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findAllProperties(@Query('number') number: number) {
    return number
      ? this.propertiesService.findOneByNumber(Number(number))
      : this.propertiesService.findAllProperties();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'b5aa7899-1c9f-4662-a0e8-fe5eee2069f1',
        number: 100,
        image:
          'https://static.tokkobroker.com/pictures/54875686735059677368693141545969812663641450316300492212526170802494178142272.jpg',
        address: 'Calle 1 - 10',
        ubication: 'https://maps.app.goo.gl/dosYom2qmP2Y3YBu7',
        code: '25BGD6',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No existe una propiedad con ese id',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findOnePropertyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOneById(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message:
          'Datos de la propiedad ${propUpdated.number} actualizados correctamente',
      },
    },
  })
  @Put(':id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    UserIdInterceptor,
    FileInterceptor('file'),
    OptionalFileInterceptorIMG,
  )
  updateProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto, file);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message: 'Propiedad ${deleteProperty.number} eliminada con exito',
      },
    },
  })
  @ApiResponse({
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message:
          'El id ingresado no pertenece a la propiedad con el numero ${deleteProperty.number}',
      },
    },
  })
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteProperty: DeletePropertyDto,
  ) {
    return this.propertiesService.deleteProperty(id, deleteProperty);
  }
}
