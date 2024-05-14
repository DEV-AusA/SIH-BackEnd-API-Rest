import { PartialType } from '@nestjs/swagger';
import { CreateAuthorizationDto } from './create-authorization.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateAuthorizationDto extends PartialType(
  CreateAuthorizationDto,
) {
  @IsOptional()
  @IsNumber()
  number?: number;
}
