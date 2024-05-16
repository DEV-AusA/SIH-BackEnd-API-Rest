import { Module } from '@nestjs/common';
import { FilesCloudinaryService } from './files-cloudinary.service';
import { FilesCloudinaryController } from './files-cloudinary.controller';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  controllers: [FilesCloudinaryController],
  providers: [FilesCloudinaryService, cloudinaryConfig],
})
export class FilesCloudinaryModule {}
