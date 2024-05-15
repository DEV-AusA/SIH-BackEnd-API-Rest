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

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('create')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createNewProperty(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.createProperty(createPropertyDto);
  }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findAllProperties(@Query('number') number: number) {
    return number
      ? this.propertiesService.findOneByNumber(Number(number))
      : this.propertiesService.findAllProperties();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  findOnePropertyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOneById(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'), OptionalFileInterceptorIMG)
  updateProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto, file);
  }

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
