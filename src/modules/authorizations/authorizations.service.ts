import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { UpdateAuthorizationDto } from './dto/update-authorization.dto';
import { DataSource, Repository } from 'typeorm';
import { Authorization } from './entities/authorization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as otpGenerator from 'otp-generator';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthorizationsService {
  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly datasource: DataSource,
  ) {}

  async createAuthorization(
    id: string,
    createAuthorizationDto: CreateAuthorizationDto,
  ) {
    if (
      createAuthorizationDto.type !== 'delivery' &&
      createAuthorizationDto.type !== 'guest'
    )
      throw new BadRequestException(
        'El tipo de autorizacion ingresado no es correcto',
      );

    const userData = await this.userService.findUserById(id);

    //generaqdor de codigos aletatorio
    const accessCode = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expirationTime = new Date(Date.now() + 120 * 60 * 1000); // 2h

    const queryRunner = await this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const authorization = await queryRunner.manager.create(Authorization, {
        ...createAuthorizationDto,
        user: id,
        accessCode,
        expirationTime,
        dateGenerated: new Date(),
      });
      const authorizationSaved = await queryRunner.manager.save(authorization);

      await queryRunner.commitTransaction();

      const { number, address } = userData.properties[0];
      const { name, lastName } = userData;

      const autorizationComplete = {
        ...authorizationSaved,
        nameProp: name,
        lastNameProp: lastName,
        numberProp: number,
        addressProp: address,
      };

      return autorizationComplete;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllAuthorizations() {
    return await this.authorizationRepository.find();
  }

  async findAllAuthorizationsByUser(id: string) {
    await this.userService.findUserById(id);
    return await this.authorizationRepository.find({ where: { user: id } });
  }

  async findOneAuthorization(code: string) {
    const authorization = await this.authorizationRepository.findOneBy({
      accessCode: code,
    });
    if (!authorization)
      throw new NotFoundException(
        'No se encuentra una autorizacion con el código ingresado.',
      );
    return authorization;
  }

  // only security rol
  async validateAuthorization(
    id: string,
    updateAuthorizationDto: UpdateAuthorizationDto,
  ) {
    const security = await this.userService.findUserById(id);
    const authorization = await this.findOneAuthorization(
      updateAuthorizationDto.code,
    );
    // validation time
    const expirationTimeUtc = new Date(authorization.expirationTime);
    if (expirationTimeUtc < new Date()) {
      throw new BadRequestException(
        'El código de autorization ha expirado, por favor genere otro',
      );
    }

    const authorizationValidate = await this.authorizationRepository.preload({
      id: authorization.id,
      guardId: security.id,
      dateUsed: new Date(),
    });

    await this.authorizationRepository.save(authorizationValidate);

    return { message: `Autorización validada con éxito` };
  }
  // only rol admin?
  async deleteAuthorization(id: string, code: string) {
    await this.userService.findUserById(id);
    const authorization = await this.findOneAuthorization(code);
    await this.authorizationRepository.delete(authorization.id);
    return {
      message: `Autorización numero ${authorization.number} eliminada con éxito.`,
    };
  }
}
