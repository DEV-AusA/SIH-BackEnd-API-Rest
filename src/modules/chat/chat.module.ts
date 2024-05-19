import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  providers: [
    ChatGateway,
    ChatService,
    UsersService,
    EmailService,
    FilesCloudinaryService,
  ],
})
export class ChatModule {}
