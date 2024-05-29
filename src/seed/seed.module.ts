import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Property } from '../modules/properties/entities/property.entity';
import { PropertiesService } from '../modules/properties/properties.service';
import { UsersService } from '../modules/users/users.service';
import { EmailService } from '../modules/email/email.service';
import { FilesCloudinaryService } from '../modules/files-cloudinary/files-cloudinary.service';
import { Establishment } from '../modules/establishment/entities/establishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, Establishment])],
  controllers: [SeedController],
  providers: [
    SeedService,
    PropertiesService,
    UsersService,
    EmailService,
    FilesCloudinaryService,
  ],
})
export class SeedModule {}
