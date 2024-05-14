import { Module } from '@nestjs/common';
import { AuthorizationsService } from './authorizations.service';
import { AuthorizationsController } from './authorizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authorization } from './entities/authorization.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Authorization, User])],
  controllers: [AuthorizationsController],
  providers: [
    AuthorizationsService,
    UsersService,
    EmailService,
    FilesCloudinaryService,
  ],
})
export class AuthorizationsModule {}
