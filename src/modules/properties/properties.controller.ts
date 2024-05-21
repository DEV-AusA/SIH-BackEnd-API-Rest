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
    status: 400,
    description: 'Ya existe una propiedad con ese codigo de identificacion',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una propiedad con ese numero de identificacion',
  })
  @Post('create')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    UserIdInterceptor,
    FileInterceptor('file'),
    OptionalFileInterceptorIMG,
  )
  createNewProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.propertiesService.createProperty(createPropertyDto, file);
  }

  @ApiBearerAuth()
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
    status: 404,
    description: 'No existe una propiedad con ese id',
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
    description:
      'Datos de la propiedad ${propUpdated.number} actualizados correctamente',
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
    description: 'Propiedad ${deleteProperty.number} eliminada con exito',
  })
  @ApiResponse({
    status: 409,
    description:
      'El id ingresado no pertenece a la propiedad con el numero ${deleteProperty.number}',
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
