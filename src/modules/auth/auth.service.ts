import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  async signUpUser(createUserDto: CreateUserDto) {
    const emailUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (emailUser)
      throw new BadRequestException(
        `Ya existe un usuario registrado con ese email.`,
      );

    const registerOk = await this.userService.signUpUser(createUserDto);
    return registerOk;
  }
}
