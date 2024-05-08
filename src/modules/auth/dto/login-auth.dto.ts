import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  user: string;

  @IsNotEmpty()
  @IsEmail()
  password: string;
}
