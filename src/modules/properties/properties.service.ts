import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async createProperty(createPropertyDto: CreatePropertyDto) {
    const propFinded = await this.propertyRepository.findOne({
      where: { number: createPropertyDto.number },
    });
    const propCode = await this.propertyRepository.findOneBy({
      code: createPropertyDto.code,
    });
    if (propFinded || propCode)
      throw new BadRequestException(
        'Ya existe una propiedad con ese numero o el codigo ingresado pertenece a otra propiedad',
      );
    const newProp = await this.propertyRepository.create(createPropertyDto);
    const newPropSaved = await this.propertyRepository.save(newProp);

    return newPropSaved;
  }

  async findAllProperties() {
    return await this.propertyRepository.find();
  }

  async findOneProperty(number: number) {
    try {
      const propFinded = await this.propertyRepository.findOne({
        where: { number },
      });
      if (!propFinded)
        throw new NotFoundException('No existe una propiedad con ese numero.');
      return propFinded;
    } catch (error) {
      throw error;
    }
  }

  async finOneByNumber(number: number) {
    try {
      const propByNumber = await this.propertyRepository.findOneBy({ number });
      if (!propByNumber)
        throw new NotFoundException(
          'No existe una propiedad con ese Numero de identificacion.',
        );
      return propByNumber;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    console.log(updatePropertyDto);
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
