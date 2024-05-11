import { Test, TestingModule } from '@nestjs/testing';
import { FilesCloudinaryController } from './files-cloudinary.controller';
import { FilesCloudinaryService } from './files-cloudinary.service';

describe('FilesCloudinaryController', () => {
  let controller: FilesCloudinaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesCloudinaryController],
      providers: [FilesCloudinaryService],
    }).compile();

    controller = module.get<FilesCloudinaryController>(
      FilesCloudinaryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
