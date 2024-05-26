import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotEmailOrUsername } from 'src/decorators/isEmailOrNot.decorator';
// import { IsNotEmail } from 'src/decorators/isEmailOrNot.decorator';

export class LoginUserDto {
  /**
   * Username del usuario.
   * @description Debe ser una cadena alfanumerica no vacía con longitud entre 3 y 50 caracteres. Debe ser una cadena no vacía con formato de email válido.
   * @example 'juanperez14'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  //   @IsNotEmail()
  @Validate(IsNotEmailOrUsername)
  user: string;

  /**
   * Contraseña del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 8 y 15 caracteres, que incluya al menos una mayúscula, una minúscula, un número y un carácter especial.
   * @example 'Password123!'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*\s).{8,15}$/, {
    message: `Algun dato ingresado es incorrecto`,
  })
  password: string;
}
