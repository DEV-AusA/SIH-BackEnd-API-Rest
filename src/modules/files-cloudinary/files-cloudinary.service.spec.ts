import { Test, TestingModule } from '@nestjs/testing';
import { FilesCloudinaryService } from './files-cloudinary.service';

describe('FilesCloudinaryService', () => {
  let service: FilesCloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesCloudinaryService],
    }).compile();

    service = module.get<FilesCloudinaryService>(FilesCloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
