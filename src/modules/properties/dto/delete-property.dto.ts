import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class DeletePropertyDto {
  /**
   * Número de la propiedad.
   * @description Debe ser un número no vacío.
   * @example 532
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly number: number;
}
