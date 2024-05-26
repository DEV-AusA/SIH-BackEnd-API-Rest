import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as propertiesData from '../helpers/preload-properties-data.json';
import * as usersData from '../helpers/preload-users.data.json';
import * as imagesPropsData from '../helpers/preload-images-data.json';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePropertyDto } from '../modules/properties/dto/create-property.dto';
import { Property } from '../modules/properties/entities/property.entity';
import { User } from '../modules/users/entities/user.entity';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    //preload on start
    await this.preloadDataUsers();
    await this.preloadDataProperties();
  }

  private async executeSeedProperties() {
    const fakeProperties = faker.helpers.multiple(this.createRandomProperties, {
      count: 40,
    });
    const propertiesPreload = propertiesData as CreatePropertyDto[];
    const properties = [...propertiesPreload, ...fakeProperties];
    const users: User[] = await this.userRepository.find({
      where: { rol: 'owner' },
    });
    // eslint-disable-next-line prefer-const
    let userIndex = 0;
    let newProp: CreatePropertyDto;

    try {
      for await (const property of properties) {
        const propFinded = await this.propertyRepository.findOneBy({
          number: property.number,
        });
        if (propFinded) continue;
        const codeGen = customAlphabet('01234567890ABCDEFGHIJ', 6);
        const code = codeGen();
        if (users[userIndex]) {
          newProp = await this.propertyRepository.create({
            ...property,
            user: users[userIndex],
            code,
            image: imagesPropsData[userIndex],
          });
        } else {
          newProp = await this.propertyRepository.create({
            ...property,
            code,
            image: imagesPropsData[userIndex],
          });
        }

        await this.propertyRepository.save(newProp);
        userIndex += 1;
      }
    } catch (error) {
      throw error;
    }
  }

  async preloadDataProperties() {
    try {
      await this.executeSeedProperties();

      Logger.log(
        'Seed de propiedades cargado correctamente',
        'PreloadData-SIH Secure Ingress Home',
      );
      const message = { message: 'Seed de propiedades cargado correctamente' };

      return message;
    } catch (error) {
      throw error;
    }
  }

  private async executeSeedUsers() {
    const usersFake = faker.helpers.multiple(this.createRandomUser, {
      count: 20,
    });
    const users = usersData;
    const totalUsers = [...users, ...usersFake];

    try {
      for await (const user of totalUsers) {
        if (user.email === 'cesarausaprog@gmail.com') {
          const userSA = await this.userRepository.findOneBy({
            email: user.email,
          });
          if (userSA) continue;
          const hashedPassword = await bcrypt.hash(user.password, 10);
          const newUser = await this.userRepository.create({
            ...user,
            password: hashedPassword,
            validate: true,
            rol: 'superadmin',
            lastLogin: new Date(),
          });
          await this.userRepository.save(newUser);
        } else {
          const userFinded = await this.userRepository.findOneBy({
            email: user.email,
          });
          if (userFinded) continue;
          const hashedPassword = await bcrypt.hash(user.password, 10);
          const newUser = await this.userRepository.create({
            ...user,
            password: hashedPassword,
            validate: true,
            lastLogin: new Date(),
          });
          await this.userRepository.save(newUser);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async preloadDataUsers() {
    try {
      await this.executeSeedUsers();

      Logger.log(
        'Seed de Usuarios cargado correctamente',
        'PreloadData-SIH Secure Ingress Home',
      );
      const message = { message: 'Seed de Usuarios cargado correctamente' };

      return message;
    } catch (error) {
      throw error;
    }
  }

  private createRandomUser() {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      document: faker.number.int(100000000),
      cellphone: faker.number.int(10000000000),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      createdAt: faker.date.between({
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-05-31T00:00:00.000Z',
      }),
    };
  }

  private createRandomProperties() {
    return {
      number: faker.number.int({ min: 104, max: 200 }),
      address: `Calle ${faker.number.octal()} ${faker.number.octal(150)}`,
    };
  }
}
