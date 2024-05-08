import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../../auth/dto/create-auth.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
