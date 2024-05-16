import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateExpenseDto {
  /**
   * Es el importe a pagar por parte del propietario por mes.
   * @description Debe ser un número no vacío.
   * @example 532
   * **/
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  /**
   * Es el id del propietario que debe pagar el importe ingresado a pagar por mes.
   * @description Debe ser un string con formato UUID.
   * @example 532
   * **/
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  userProperty: string;
}
