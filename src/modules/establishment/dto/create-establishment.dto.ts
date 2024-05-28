import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPositiveOrZero } from 'src/decorators/is-positive-or-zero.decorator';

export class CreateEstablishmentDto {
  /**
   * Descripción del Establesimiento.
   * @description Debe ser una cadena string.
   * @example 'Establesimiento de prueba'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Noticias del Establesimiento.
   * @description Debe ser una cadena string.
   * @example 'La semana proxima es el fin... de esta semana'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  news: string;

  /**
   * Ubicación de google maps del Establesimiento.
   * @description Debe ser una cadena string.
   * @example '???.??.??'
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location: string;

  /**
   * Fecha de inicio de una noticia o evento del Establesimiento.
   * @description Debe ser una fecha.
   * @example '2022-01-01'
   */
  @IsOptional()
  @IsDate()
  startDate: Date;

  /**
   * Fecha de fin de una noticia o evento del Establesimiento.
   * @description Debe ser una fecha.
   * @example '2022-01-01'
   */
  @IsOptional()
  // @IsDate()
  finishDate: Date;

  /**
   * Direccion del Establesimiento.
   * @description Debe ser una cadena alfanumerica no vacía.
   * @example '9 de Julio 1234'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9 ]+$/)
  @IsOptional()
  readonly address: string;

  /**
   * Número de teléfono fijo del Establesimiento, es opcional.
   * @description Debe ser un número no vacío.
   * @example 1234567890
   */
  @IsOptional()
  @IsNumber()
  @Validate(IsPositiveOrZero) // custom decorator exclusivo para este campo
  readonly phone?: number;

  /**
   * Número de celular personal del Establesimiento.
   * @description Debe ser un número no vacío.
   * @example 1234567890
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly cellphone: number;

  /**
   * Correo electrónico del Establesimiento.
   * @description Debe ser una cadena no vacía con formato de email válido.
   * @example 'usuario@example.com'
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Caracteres inválidos en el correo electrónico',
  })
  readonly email: string;
}
