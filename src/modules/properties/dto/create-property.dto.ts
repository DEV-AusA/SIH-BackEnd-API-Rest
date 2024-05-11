import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
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
   * URL de la imagen de la propíedad.
   * @description Debe ser una cadena URL válida.
   * @example 'https://example.com/propiedad145.jpg'
   */
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly image: string;

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
   * URL de la ubicacion de la propíedad en google maps.
   * @description Debe ser una cadena URL válida.
   * @example 'https://maps.app.goo.gl/8FVhZiSY1k1ds2dfr2s1'
   */
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly ubication: string;

  /**
   * codigo de vinculo de la propiedad.
   * @description Debe ser una cadena alfanumerica no vacía.
   * @example 'E3T56YU'
   */
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9]+$/)
  readonly code?: string;
}
