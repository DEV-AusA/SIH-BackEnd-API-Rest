import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageData } from './dto/data-chat.dto';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      const { id, name, token } = socket.handshake.auth;

      if (!id || !name || !token) {
        socket.emit(
          'error',
          'Falta algún dato en la autorización para conectarse',
        );
        socket.disconnect();
        return;
      }

      const personalSecurity = await this.chatService.getSecurityPersonal();
      const users = await this.chatService.getUsersProp();

      this.server.emit('security-personal', personalSecurity);
      this.server.emit('users-list', users);

      try {
        const secret = process.env.JWT_SECRET;
        const dataTokenUser = await this.jwtService.verify(token, { secret });

        const userExist = await this.userService.findUserById(id);
        if (!userExist) {
          socket.emit('error', 'No existe un usuario con ese ID');
          socket.disconnect();
          return;
        }

        if (id !== dataTokenUser.id) {
          socket.emit('error', 'Debes ingresar con tu propia cuenta');
          socket.disconnect();
          return;
        }

        this.chatService.onClientConnected({ id: socket.id, name: name });
        this.server.emit('on-clients-changed', this.chatService.getClients());

        socket.on('disconnect', () => {
          this.chatService.onClientDisconnected(socket.id);
          this.server.emit('on-clients-changed', this.chatService.getClients());
        });
      } catch (error) {
        socket.emit('error', 'No autorizado, desconectando');
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() dataMessage: MessageData,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, message } = dataMessage;
    const { id, name, date } = client.handshake.auth;
    if (!message) return;

    const chat: CreateChatDto = {
      userId: id,
      name,
      message,
      messageDate: date,
    };
    await this.chatService.createChat(chat);

    if (roomId && message) {
      this.server
        .to(roomId)
        .emit('on-message', { userId: id, name, message, roomIdChat: roomId });
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // const { id, name, date } = client.handshake.auth;

    client.join(roomId);
    client.emit('joined-room', roomId);

    const room = this.server.sockets.adapter.rooms.get(roomId);
    const usersInRoom = room ? Array.from(room) : [];
    console.log(
      `Hay ${usersInRoom.length} usuarios conectados en la sala ${roomId}: `,
      usersInRoom,
    );
  }
}
