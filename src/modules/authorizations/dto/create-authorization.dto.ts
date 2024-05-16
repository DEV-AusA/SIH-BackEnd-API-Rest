import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsEightDigits } from '../../../decorators/digit-count.decorator';

export class CreateAuthorizationDto {
  /**
   * Tipo de Autorizacion.
   * @description Debe ser de tipo guest o delivery, no vacía con longitud entre 3 y 50 caracteres.
   * @example 'guest'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z]+$/)
  readonly type: string;

  /**
   * Nombre del destinatario de la autorizacion o nombre de la empresa de delivery.
   * @description Debe ser una cadena, no vacía con longitud entre 3 y 50 caracteres.
   * @example 'Fernando Perez o MercadoLibre'
   */
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z ]+$/)
  readonly name?: string;

  /**
   * Número de documento del destinatario en caso de ser de tipo guest.
   * @description Debe ser un número no vacío.
   * @example 50345678
   */
  @IsOptional()
  @IsNumber()
  @Validate(IsEightDigits) // custom decorator
  readonly document?: number;

  /**
   * Número de envio en caso de ser de tipo delivery.
   * @description Debe ser de tipo string no vacío.
   * @example 5678
   */
  @IsOptional()
  @IsString()
  readonly shipmentNumber?: string;
}
