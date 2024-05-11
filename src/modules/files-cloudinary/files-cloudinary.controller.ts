import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { FilesCloudinaryService } from './files-cloudinary.service';

@Controller('files-cloudinary')
export class FilesCloudinaryController {
  constructor(
    private readonly filesCloudinaryService: FilesCloudinaryService,
  ) {}

  @Post()
  createFile() {
    return;
  }

  @Get()
  findAll() {
    return;
  }

  @Get(':id')
  findOne() {
    return;
  }

  @Patch(':id')
  update() {
    return;
  }

  @Delete(':id')
  remove() {
    return;
  }
}
