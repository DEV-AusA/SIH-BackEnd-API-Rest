import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class EstablishmentService {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createEstablishmentDto: CreateEstablishmentDto) {
    const newEstablishment = await this.establishmentRepository.create(
      createEstablishmentDto,
    );

    await this.establishmentRepository.save(newEstablishment);

    return {
      message: 'Establecimiento creado',
    };
  }

  async findAll() {
    const establishments = await this.establishmentRepository.find();
    if (!establishments)
      throw new NotFoundException('No se encontraron establecimientos');
    return establishments;
  }

  findOne(id: number) {
    return `This action returns a #${id} establishment`;
  }

  async update(id: string, updateEstablishmentDto: UpdateEstablishmentDto) {
    const establishmentValidate = await this.establishmentRepository.findOne({
      where: { id },
    });
    if (!establishmentValidate)
      throw new NotFoundException('El establecimiento no existe');

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateEstablishment = await queryRunner.manager.preload(
        Establishment,
        { id, ...updateEstablishmentDto },
      );
      const userModified = await queryRunner.manager.save(updateEstablishment);
      await queryRunner.manager.save(userModified);
      await queryRunner.commitTransaction();

      return {
        message: 'Establecimiento actualizado',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} establishment`;
  }
}
