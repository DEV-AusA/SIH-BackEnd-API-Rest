import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  findAllProperties() {
    return this.propertiesService.findAllProperties();
  }

  @Get()
  findOneProperty(@Query('name') number: string) {
    return this.propertiesService.findOneProperty(Number(number));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(Number(id), updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(Number(id));
  }
}
