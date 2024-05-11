import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import { GoogleStrategy } from '../../helpers/google-strategy';
import { SessionSerializer } from '../../helpers/serializer';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    GoogleStrategy,
    SessionSerializer,
    EmailService,
    FilesCloudinaryService,
  ],
})
export class AuthModule {}
