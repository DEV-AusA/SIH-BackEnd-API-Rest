import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post()
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentService.create(createEstablishmentDto);
  }

  @Get()
  findAll() {
    return this.establishmentService.findAll();
  }

  @Put(':id')
  update(
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @Body('id') id: string,
  ) {
    return this.establishmentService.update(id, updateEstablishmentDto);
  }
}
