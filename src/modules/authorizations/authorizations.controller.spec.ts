import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationsController } from './authorizations.controller';
import { AuthorizationsService } from './authorizations.service';

describe('AuthorizationsController', () => {
  let controller: AuthorizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationsController],
      providers: [AuthorizationsService],
    }).compile();

    controller = module.get<AuthorizationsController>(AuthorizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
