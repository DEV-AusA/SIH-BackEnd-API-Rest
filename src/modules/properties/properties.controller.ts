import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

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
      ? this.propertiesService.findOneProperty(Number(number))
      : this.propertiesService.findAllProperties();
  }

  @Patch(':id')
  updateProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateProperty(Number(id), updatePropertyDto);
  }

  @Delete(':id')
  deleteProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() number: number,
  ) {
    return this.propertiesService.deleteProperty(id, number);
  }
}
