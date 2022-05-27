import { Test, TestingModule } from '@nestjs/testing';
import { SpaceRoleController } from './space-role.controller';

describe('SpaceRoleController', () => {
  let controller: SpaceRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceRoleController],
    }).compile();

    controller = module.get<SpaceRoleController>(SpaceRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
