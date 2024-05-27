import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreatePayDto {
  /**
   * Es el importe a pagar por parte del propietario por mes.
   * @description Debe ser un número no vacío.
   * @example 532
   * **/
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  /**
   * Es el id de la expensa.
   * @description Debe ser un string con formato UUID.
   * @example 532
   * **/
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
