import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Request, Response } from 'express';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreatePayDto } from './dto/create-pay.dto';
import { UpdateExpenceDto } from './dto/update-expense.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/helpers/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Expensas')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        urlMercadopago:
          'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1810727269-591cff37-155c-4fd6-a9e5-b47e6ca8088e',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'La expensa no existe',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Post('createPay')
  createPay(@Body() createPayDto: CreatePayDto) {
    return this.expensesService.createPay(createPayDto);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        state: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'La expensa ya esta pagada',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'Pago de expensa rechazado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Post('state')
  async statu(@Req() request: Request) {
    return this.expensesService.statu(request.body.data.id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: '38f6cb56-b1af-4881-8d6c-54ef212d2bcc',
          ticket: 1,
          typeExpenses: 'Expensa Mensual',
          numberOperation: null,
          userProperty: 'b91b3364-28f7-424f-8e11-d1a819649213',
          description: 'Seguridad - Limpieza - Mantenimento',
          amount: '2000.00',
          dateGenerated: '2024-05-25',
          datePaid: null,
          dayLimit: 30,
          interests: null,
          state: false,
        },
        {
          id: '9de940dd-ebe3-49ec-bdf9-99a8cb24a189',
          ticket: 1,
          typeExpenses: 'Expensa Mensual',
          numberOperation: null,
          userProperty: '54eee50c-aaa6-4aa0-ba76-d5664755ac91',
          description: 'Seguridad - Limpieza - Mantenimento',
          amount: '2000.00',
          dateGenerated: '2024-05-25',
          datePaid: null,
          dayLimit: 30,
          interests: null,
          state: false,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No hay expensas',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getExpenses() {
    return this.expensesService.getExpenses();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: 'fd289ed6-f03e-4e1c-a97e-fb7c511385c3',
          ticket: 1,
          typeExpenses: 'Expensa Mensual',
          numberOperation: null,
          userProperty: 'eb968a88-82dc-4efc-bee5-408a62c9430f',
          description: 'Seguridad - Limpieza - Mantenimento',
          amount: '2000.00',
          dateGenerated: '2024-05-25',
          datePaid: null,
          dayLimit: 30,
          interests: null,
          state: false,
          property: {
            id: '1b2ba4ff-b231-4a07-9f45-a846a0ffe363',
            number: 100,
            image:
              'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
            address: 'Calle 1 10',
            code: '68C99A',
            user: {
              id: 'eb968a88-82dc-4efc-bee5-408a62c9430f',
              username: 'Caitlyn_Kub',
              password:
                '$2b$10$1SpkNKb4P9CrseT88EkziO/jwOIw4RU4qvav7XlRam9dFy0lmumeC',
              name: 'Beulah',
              lastName: 'Schmeler',
              document: 53189591,
              image:
                'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/413.jpg',
              phone: null,
              cellphone: '7595067024',
              email: 'Lura.Kunze60@gmail.com',
              googleAccount: false,
              validate: true,
              state: true,
              rol: 'owner',
              lastLogin: '2024-05-25T15:07:25.293Z',
              adminModify: null,
              properties: [
                {
                  id: '1b2ba4ff-b231-4a07-9f45-a846a0ffe363',
                  number: 100,
                  image:
                    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
                  address: 'Calle 1 10',
                  code: '68C99A',
                },
              ],
            },
          },
        },
        {
          id: '0c08fe0d-f56e-4e22-9568-d45177be0d8b',
          ticket: 1,
          typeExpenses: 'Expensa Mensual',
          numberOperation: null,
          userProperty: 'eefbe0ba-45f7-4157-8703-c053527cbd8d',
          description: 'Seguridad - Limpieza - Mantenimento',
          amount: '2000.00',
          dateGenerated: '2024-05-25',
          datePaid: null,
          dayLimit: 30,
          interests: null,
          state: false,
          property: {
            id: '1b630923-49ab-42e7-80fa-1e95ada6c9b9',
            number: 101,
            image:
              'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
            address: 'Calle 1 11',
            code: '8D4G4F',
            user: {
              id: 'eefbe0ba-45f7-4157-8703-c053527cbd8d',
              username: 'martin45',
              password:
                '$2b$10$YHe0i6cf59Z9Zccs5qhdq.eo7PSjmj7L66oR4PPxXEC/quX09HaMG',
              name: 'Ernesto',
              lastName: 'Perez',
              document: 50234561,
              image:
                'https://res.cloudinary.com/dcqdilhek/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1716433737/hombre3_pmw7sl.jpg',
              phone: null,
              cellphone: '1198765432',
              email: 'martin.perez@example.com',
              googleAccount: false,
              validate: true,
              state: true,
              rol: 'owner',
              lastLogin: '2024-05-25T15:07:23.664Z',
              adminModify: null,
              properties: [
                {
                  id: '1b630923-49ab-42e7-80fa-1e95ada6c9b9',
                  number: 101,
                  image:
                    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
                  address: 'Calle 1 11',
                  code: '8D4G4F',
                },
              ],
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No hay expensas',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get('properties')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getExpensesProperties() {
    return this.expensesService.getExpensesProperties();
  }

  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example:
        '<Buffer 25 50 44 46 2d 31 2e 33 0a 25 ff ff ff ff 0a 39 20 30 20 6f 62 6a 0a 3c 3c 0a 2f 50 72 65 64 69 63 74 6f 72 20 31 35 0a 2f 43 6f 6c 6f 72 73 20 33 0a ... 28071 more bytes>',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'La expensa no existe',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get('generatePdf/:id')
  // @Roles(Role.Admin, Role.SuperAdmin, Role.Owner, Role.Security)
  // @UseGuards(AuthGuard, RolesGuard)
  async generatePdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    // const pdfBuffer = await new PdfInvoiceHelper().geteratePdfPuppeteer();
    // const pdfBuffer = await new PdfInvoiceHelper().generatePdfJsPDF();
    // const pdfBuffer = await new PdfInvoiceHelper().generatePdfPDFKit();

    const pdfBuffer = await this.expensesService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=hello-world.pdf',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        id: 'a098a45d-c5c6-4a93-b535-84b87e92062f',
        number: 100,
        image:
          'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
        address: 'Calle 1 10',
        code: '98D1IH',
        expences: [
          {
            id: '26793eec-cc1a-424d-81b4-f8082496f8a4',
            ticket: 1,
            typeExpenses: 'Expensa Mensual',
            numberOperation: null,
            userProperty: '159f53f1-a922-4243-80dd-c6ec948b8e2e',
            description: 'Seguridad - Limpieza - Mantenimento',
            amount: '2000.00',
            dateGenerated: '2024-05-25',
            datePaid: null,
            dayLimit: 30,
            interests: null,
            state: false,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontro Propiedad',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get('property/:id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.Owner, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  getExpensePropertyId(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.getExpensePropertyId(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: [
        {
          id: '1b2ba4ff-b231-4a07-9f45-a846a0ffe363',
          number: 100,
          image:
            'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
          address: 'Calle 1 10',
          code: '68C99A',
          expences: [
            {
              id: 'fd289ed6-f03e-4e1c-a97e-fb7c511385c3',
              ticket: 1,
              typeExpenses: 'Expensa Mensual',
              numberOperation: null,
              userProperty: 'eb968a88-82dc-4efc-bee5-408a62c9430f',
              description: 'Seguridad - Limpieza - Mantenimento',
              amount: '2000.00',
              dateGenerated: '2024-05-25',
              datePaid: null,
              dayLimit: 30,
              interests: null,
              state: false,
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontro Usuarios',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontro Propiedades',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Get('user/:id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.Owner, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  getExpenseUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.getExpensesUserId(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Expensas creadas para todos los propietarios',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No hay propietarios activos',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'No se encontro Usuarios',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 406,
    description: 'Error: Not Acceptable',
    schema: {
      example: {
        message:
          'No se puede generar expensas, el limite de dias es de 30, faltan 25 dias',
        error: 'Not Acceptable',
        statusCode: 406,
      },
    },
  })
  @Post('createAllExpenses')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createAllExpenses(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createAllExpenses(createExpenseDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Expensa creada',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'La Propiedad no existe',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Post('createExpense')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createExpense(createExpenseDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      example: {
        message: 'Expensa actualizada',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    schema: {
      example: {
        message: 'La expensa no existe',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Put('updateExpence/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  updateExpence(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenceDto: UpdateExpenceDto,
  ) {
    return this.expensesService.updateExpence(updateExpenceDto, id);
  }
}
