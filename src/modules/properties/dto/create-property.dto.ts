import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePropertyDto {
  /**
   * Número de la propiedad.
   * @description Debe ser un número no vacío.
   * @example 532
   */
  @IsNotEmpty()
  @IsNumber()
  readonly number: number;

  /**
   * Direccion de la propiedad.
   * @description Debe ser una cadena alfanumerica no vacía.
   * @example '9 de Julio 1234'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9 ]+$/)
  readonly address: string;

  /**
   * codigo de vinculo de la propiedad.
   * @description Debe ser una cadena alfanumerica no vacía, es OPCIONAL en caso de no introducir uno le backen genera uno automaticamente.
   * @example 'E3T56YU'
   */
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9]+$/)
  readonly code?: string;
}
