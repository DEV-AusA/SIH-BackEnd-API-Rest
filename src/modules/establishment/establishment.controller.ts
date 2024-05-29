import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Establishment')
@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Establecimiento creado',
      },
    },
  })
  @Post('create')
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentService.create(createEstablishmentDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: 'deaca609-ee7e-4ac0-a9f8-ce4f41244156',
          establishment: 2491,
          description: 'Majestuosas montañas a la vista.',
          news: 'Aviso: Toque de queda a partir de las 20:00 hs. Cualquier duda o consulta, ponte en contacto con el administrador. Evento: La piscina comunitaria estará disponible desde el 05-03 hasta el 06-03',
          startDate: null,
          finishDate: null,
          location:
            'https://www.google.com/maps/embed?pb=!4v1716930958857!6m8!1m7!1sZhPp_4rPHGKqz7kKTuLJhg!2m2!1d4.676560259493725!2d-74.05847820842625!3f123.11657942843286!4f24.838748241785638!5f0.7820865974627469',
          address: 'Calle 1 1',
          email: 'barrioMañanita@example.com',
          phone: null,
          cellphone: '1122334455',
          image:
            'https://i.pinimg.com/originals/7d/7b/3b/7d7b3b6e5a8a1d1d0e8b0b0e0b0b0b0b0.jpg',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontro establecimiento',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get()
  findAll() {
    return this.establishmentService.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Establecimiento actualizado',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'El establecimiento no existe',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Put('update/:id')
  update(
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @Param('id') id: string,
  ) {
    return this.establishmentService.update(id, updateEstablishmentDto);
  }
}
