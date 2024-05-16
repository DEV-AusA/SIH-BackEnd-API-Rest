import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { FilesCloudinaryService } from '../files-cloudinary/files-cloudinary.service';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
    FilesCloudinaryService,
    cloudinaryConfig,
  ],
})
export class UsersModule {}
