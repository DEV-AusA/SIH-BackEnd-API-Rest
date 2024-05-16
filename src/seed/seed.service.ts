import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as propertiesData from '../helpers/preload-properties-data.json';
import * as usersData from '../helpers/preload-users.data.json';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePropertyDto } from '../modules/properties/dto/create-property.dto';
import { Property } from '../modules/properties/entities/property.entity';
import { User } from '../modules/users/entities/user.entity';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';

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
    const properties = propertiesData as CreatePropertyDto[];
    const users: User[] = await this.userRepository.find();
    // eslint-disable-next-line prefer-const
    let userIndex = 0;

    try {
      for await (const property of properties) {
        const codeGen = customAlphabet('01234567890ABCDEFGHIJ', 6);
        const code = codeGen();
        const newProp = await this.propertyRepository.create({
          ...property,
          user: users[userIndex],
          code,
        });

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
    const users = usersData;

    try {
      for await (const user of users) {
        if (user.email === 'cesarausaprog@gmail.com') {
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
}
