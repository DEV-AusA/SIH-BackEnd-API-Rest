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
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DeletePropertyDto } from './dto/delete-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('create')
  createNewProperty(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.createProperty(createPropertyDto);
  }

  @Get()
  findAllProperties(@Query('number') number: number) {
    return number
      ? this.propertiesService.findOneByNumber(Number(number))
      : this.propertiesService.findAllProperties();
  }

  @Get(':id')
  findOnePropertyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOneById(id);
  }

  @Put(':id')
  updateProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto);
  }

  @Delete(':id')
  deleteProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteProperty: DeletePropertyDto,
  ) {
    return this.propertiesService.deleteProperty(id, deleteProperty);
  }
}
