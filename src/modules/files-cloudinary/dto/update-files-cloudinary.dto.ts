import { PartialType } from '@nestjs/swagger';
import { CreateFilesCloudinaryDto } from './create-files-cloudinary.dto';

export class UpdateFilesCloudinaryDto extends PartialType(
  CreateFilesCloudinaryDto,
) {}
