import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { DataSource, Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { customAlphabet } from 'nanoid';
import { DeletePropertyDto } from './dto/delete-property.dto';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly dataSource: DataSource,
    private readonly filesCloudinaryService: FilesCloudinaryService,
  ) {}

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    file: Express.Multer.File,
  ) {
    const propFinded = await this.propertyRepository.findOne({
      where: { number: createPropertyDto.number },
    });
    if (propFinded)
      throw new ConflictException(
        'Ya existe una propiedad con ese numero de identificacion',
      );

    // code unique?
    const codeGen = customAlphabet('01234567890ABCDEFGHIJ', 6);
    const code = createPropertyDto.code ? createPropertyDto.code : codeGen();

    const propCode = await this.propertyRepository.findOneBy({ code });
    if (propCode)
      throw new BadRequestException(
        'Ya existe una propiedad con ese codigo de identificacion',
      );
    if (!file)
      throw new BadRequestException(
        'Debes cargar alguna imagen para la propiedad.',
      );

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createUrlImage = await this.filesCloudinaryService.createFile(file);
      const preloadData = await queryRunner.manager.create(Property, {
        ...createPropertyDto,
        image: createUrlImage.secure_url,
      });
      const propCreated = await queryRunner.manager.save(preloadData);
      await queryRunner.commitTransaction();

      return propCreated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    // const newProp = await this.propertyRepository.create({
    //   ...createPropertyDto,
    //   code,
    // });
    // const newPropSaved = await this.propertyRepository.save(newProp);

    // return newPropSaved;
  }

  async findAllProperties() {
    return await this.propertyRepository.find();
  }

  async findOneById(id: string) {
    try {
      const propFinded = await this.propertyRepository.findOne({
        where: { id },
      });
      if (!propFinded)
        throw new NotFoundException('No existe una propiedad con ese id.');

      return propFinded;
    } catch (error) {
      throw error;
    }
  }

  async findOneByNumber(number: number) {
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

  async updateProperty(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    file: Express.Multer.File,
  ) {
    await this.findOneById(id);
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const uploadedImage = await this.filesCloudinaryService.createFile(file);
      const preloadData = await queryRunner.manager.preload(Property, {
        id,
        ...updatePropertyDto,
        image: uploadedImage.secure_url,
      });
      const propUpdated = await queryRunner.manager.save(preloadData);
      await queryRunner.commitTransaction();

      return {
        message: `Datos de la propiedad ${propUpdated.number} actualizados correctamente`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProperty(id: string, deleteProperty: DeletePropertyDto) {
    try {
      const propById = await this.findOneById(id);
      if (propById.number !== deleteProperty.number)
        throw new ConflictException(
          `El id ingresado no pertenece a la propiedad con el numero ${deleteProperty.number}`,
        );
      await this.propertyRepository.delete(id);

      return {
        message: `Propiedad ${deleteProperty.number} eliminada con exito`,
      };
    } catch (error) {
      throw error;
    }
  }
}
