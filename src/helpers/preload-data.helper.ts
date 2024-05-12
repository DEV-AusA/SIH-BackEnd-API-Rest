import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as usersData from './preload-users.data.json'; // Importa el JSON
import * as bcrypt from 'bcrypt';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class DataLoaderService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async loadUsersFromJson() {
    try {
      const users = usersData as User[]; // Convierte el JSON a un array de categorías
      await Promise.all(
        users.map(async (user) => {
          const isUser = await this.usersRepository.findOneBy({
            email: user.email,
          });
          if (!isUser) {
            if (user.email === 'cesarausaprog@gmail.com') {
              const hashedPassword = await bcrypt.hash(user.password, 10);
              user.password = hashedPassword;
              user.validate = true;
              user.rol = 'superadmin';
              user.lastLogin = new Date();
            } else {
              const hashedPassword = await bcrypt.hash(user.password, 10);
              user.password = hashedPassword;
              user.validate = true;
              user.lastLogin = new Date();
            }
            return await this.usersRepository.save(user);
          }
        }),
      );
      Logger.log('Usuarios cargados desde el JSON correctamente', 'DataLoader');
    } catch (error) {
      Logger.error(
        'Error al cargar los usuarios desde el JSON',
        error.stack,
        'DataLoader',
      );
      throw error;
    }
  }
}
