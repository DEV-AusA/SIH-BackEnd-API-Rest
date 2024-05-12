import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePropertyDto {
  /**
   * Número de la propiedad.
   * @description Debe ser un número no vacío.
   * @example 532
   */
  @IsNotEmpty()
  @IsNumber()
  readonly number: number;
}
