import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Request } from 'express';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreatePayDto } from './dto/create-pay.dto';
import { IsNotEmpty } from 'class-validator';
import { UpdateExpenceDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('createPay')
  createPay(@Body() createPayDto: CreatePayDto) {
    // const url = await this.expensesService.createAllExpenses();
    // res.redirect(url);
    return this.expensesService.createPay(createPayDto);
  }

  @Post('state')
  async statu(@Req() request: Request) {
    console.log(request.body);
    const resul = this.expensesService.statu(request.body.data.id);
    return resul;
  }

  @Get()
  getExpenses() {
    return this.expensesService.getExpenses();
  }

  @Get('properties')
  getExpensesProperties() {
    return this.expensesService.getExpensesProperties();
  }

  @Get(':id')
  getExpencesUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.getExpensesUserId(id);
  }

  @Post('createAllExpenses')
  createAllExpenses(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.createAllExpenses(createExpenseDto);
  }

  @Post('createExpense/:id')
  @UseInterceptors(IsNotEmpty)
  createExpense(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.createExpense(createExpenseDto, id);
  }

  @Put('updateExpence/:id')
  updateExpence(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenceDto: UpdateExpenceDto,
  ) {
    return this.expensesService.updateExpence(updateExpenceDto, id);
  }
}
