import { IsInt, IsString, IsUUID } from 'class-validator';
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
   * Dias de limite de expensa.
   * @description Debe ser un número Entero.
   * @example 30
   */
  @IsOptional()
  @IsNumber()
  @IsInt()
  dayLimit: number;

  /**
   * Interes de expensa en porcentaje.
   * @description Debe ser un número Entero.
   * @example 5
   */
  @IsOptional()
  @IsNumber()
  interests: number;

  /**
   * Es el id de la propiedad, en la cual se va a registrar la expensa.
   * @description Debe ser un string con formato UUID.
   * @example 532
   * **/
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  id: string;
}
