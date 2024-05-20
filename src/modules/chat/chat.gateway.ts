import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    //TODO: ON
    this.server.on('connection', async (socket: Socket) => {
      // en el socket se recibe toda la info de la conexion, ejm las cookies, el token, etc.
      // console.log('Cliente conectado: ', socket);

      const { id, name, token } = socket.handshake.auth; // aca viene los parametros enviados de la coenxion del socket
      // console.log({ id, name, token });
      if (!id || !name || !token) {
        socket.emit(
          'error',
          'Falta algun dato en la autorizacion para conectarse',
        );
        socket.disconnect();
        return;
      }

      try {
        // todo: aca añadir logica para validar el token  START
        const secret = process.env.JWT_SECRET;
        const dataTokenUser = await this.jwtService.verify(token, { secret });

        const userExist = await this.userService.findUserById(id);
        if (!userExist) {
          socket.emit('error', 'No existe un usuario con ese ID');
          socket.disconnect();
        }

        if (id !== dataTokenUser.id) {
          socket.emit('error', 'Debes ingresar con tu propia cuenta');
          socket.disconnect();
        }
        // todo: aca añadir logica para validar el token  END

        // Crear una sala para el usuario
        const roomName = `room_${id}`;
        socket.join(roomName);

        this.chatService.onClientConnected({ id: socket.id, name: name });

        this.server.emit('on-clients-changed', this.chatService.getClients());

        socket.emit('welcome-message', `Bienvenido ${name} al chat`);

        // Enviar un mensaje a la sala del usuario
        socket
          .to(roomName)
          .emit('message', `Has sido conectado a la sala ${roomName}`);

        // // agregando el cliente al listado
        // this.chatService.onClientConnected({ id: socket.id, name: name });
        // //Aviso del Listado de clientes conectados
        // this.server.emit('on-clients-changed', this.chatService.getClients());
        // //mensaje de bienvenida SOLO AL CLIENTE QUE SE CONECTA
        // socket.emit('welcome-message', `Bienvenido ${name} al servidor`);
      } catch (error) {
        socket.emit('error', 'No autorizado, desconectando');
        socket.disconnect();
      }

      // TODO: OFF
      socket.on('disconnect', () => {
        console.log('Cliente desconectado: ', socket.id);

        // verificar el token el usuario antes de conectarse aca y usar el id del payload del token en lugar del socket.id
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients());
      });
    });
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { id, name, date } = client.handshake.auth;
    if (!message) return;

    console.log({ id, name, message, date });
    const chat: CreateChatDto = {
      userId: id,
      name,
      message,
      messageDate: date,
    };

    //todo: ver despues desde aca la logica para guardar los mensajes en la DB
    //save chat
    await this.chatService.createChat(chat);

    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    });
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
