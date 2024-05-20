import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsNotEmpty, IsNumber } from 'class-validator';

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
   * Descripción de la expensa.
   * @description Puede ser una cadena de texto
   * @example 'Expensa de prueba'
   */
  @IsOptional()
  @IsString()
  description: string;
  /**
   * Es el id del propietario que debe pagar el importe ingresado a pagar por mes.
   * @description Debe ser un string con formato UUID.
   * @example 532
   * **/
  // @IsNotEmpty()
  // @IsUUID()
  // @IsOptional()
  // userProperty: string;
}
