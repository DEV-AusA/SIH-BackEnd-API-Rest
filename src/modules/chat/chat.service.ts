import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { In, Not, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

interface Client {
  id: string;
  name: string;
}

@Injectable()
export class ChatService {
  @InjectRepository(Chat)
  private readonly chatRepository: Repository<Chat>;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  private clients: Record<string, Client> = {};

  onClientConnected(client: Client) {
    //crea el array con todos los clientes conectados
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    // elimina al cliente al descoenctarse
    delete this.clients[id];
  }

  getClients() {
    //retornar el listado de clientes conectados [Clien, Client, Client]
    const clients = Object.values(this.clients);

    return clients;
  }
  async getSecurityPersonal() {
    //retornar el listado de clientes conectados [Clien, Client, Client]
    const personal = await this.userRepository.find({
      where: { rol: 'security' },
      select: ['id', 'name', 'image', 'lastLogin'],
    });

    return personal;
  }

  async getUsersProp() {
    const excludedRoles = ['security', 'admin', 'superadmin'];
    const users = await this.userRepository.find({
      where: { rol: Not(In(excludedRoles)) },
      select: ['id', 'name', 'image', 'lastLogin'],
    });

    return users;
  }

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = await this.chatRepository.create(createChatDto);
    return await this.chatRepository.save(chat);
  }

  async getMessagesByRoomId(roomId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { roomIdChat: roomId },
      order: { messageDate: 'ASC' },
    });
  }
}
