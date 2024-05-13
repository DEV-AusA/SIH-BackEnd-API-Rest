import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';
import { Repository } from 'typeorm';
import { Authorization } from './entities/authorization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationsService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAuthorization(
    id: string,
    createAuthorizationDto: CreateAuthorizationDto,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('No existe un usuario con ese id');

    if (
      createAuthorizationDto.type !== 'delivery' &&
      createAuthorizationDto.type !== 'guest'
    )
      throw new BadRequestException(
        'El tipo de autorizacion ingresado es el incorrecto',
      );

    const payload = {
      id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '2h' }); //2 horas?

    const authorization = await this.authorizationRepository.create({
      ...createAuthorizationDto,
      user: id,
      token,
      dateGenerated: new Date(),
    });
    const authorizationSaved =
      await this.authorizationRepository.save(authorization);

    return authorizationSaved;
  }

  async findAllAuthorizations() {
    return await this.authorizationRepository.find();
  }

  async findOneAuthorization(number: number) {
    const authorization = await this.authorizationRepository.findOneBy({
      number,
    });
    if (!authorization)
      throw new NotFoundException(
        'No se encuentra una autorizacion con es numero ingresado.',
      );
    return authorization;
  }

  update(id: number, updateAuthorizationDto: UpdateAuthorizationDto) {
    return `This action updates a #${id} authorization`;
  }

  remove(id: number) {
    return `This action removes a #${id} authorization`;
  }
}
