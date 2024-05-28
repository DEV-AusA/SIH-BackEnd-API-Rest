import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post('create')
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentService.create(createEstablishmentDto);
  }

  @Get()
  findAll() {
    return this.establishmentService.findAll();
  }

  @Put('update/:id')
  update(
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @Param('id') id: string,
  ) {
    return this.establishmentService.update(id, updateEstablishmentDto);
  }
}
