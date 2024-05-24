import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthorizationDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
