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
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/helpers/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Expensas')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('createPay')
  createPay(@Body() createPayDto: CreatePayDto) {
    return this.expensesService.createPay(createPayDto);
  }

  @Post('state')
  async statu(@Req() request: Request) {
    return this.expensesService.statu(request.body.data.id);
  }

  @Get('properties')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getExpensesProperties() {
    return this.expensesService.getExpensesProperties();
  }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getExpenses() {
    return this.expensesService.getExpenses();
  }

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

  @Get('user/:id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.Owner, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  getExpenseUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.getExpensesUserId(id);
  }

  @Get('property/:id')
  @Roles(Role.Admin, Role.SuperAdmin, Role.Owner, Role.Security)
  @UseGuards(AuthGuard, RolesGuard)
  getExpensePropertyId(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.getExpensePropertyId(id);
  }

  @Post('createAllExpenses')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createAllExpenses(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createAllExpenses(createExpenseDto);
  }

  @Post('createExpense')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createExpense(createExpenseDto);
  }

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
